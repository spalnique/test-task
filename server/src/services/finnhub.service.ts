import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import WebSocket, { RawData } from 'ws';

import { finnhubConfig } from '@configs';
import { countryExData } from '@constants';
import {
  ClientFinnhubEvent,
  CountryExchangeData,
  QueryResult,
  StockData,
  Symbol,
} from '@types';

export class FinnhubAPIService {
  private readonly axios: AxiosInstance = axios.create(finnhubConfig);
  private readonly websocket: WebSocket;
  private readonly allCountries: CountryExchangeData[] = countryExData;
  private prevCountry: string = '';

  private prevCountrySymbols: Symbol[] = [];
  private activeAbortControllers: AbortController[] = [];

  private result: QueryResult = {
    stock_data: [],
    pagination: {
      page: 1,
      per_page: 5,
      total_items: 0,
      total_pages: 0,
    },
  };

  constructor(websocket: WebSocket) {
    this.websocket = websocket;
    this.setupClientEventHandlers();
    this.sendToClient({
      type: 'ready',
      data: { country_list: this.allCountries },
    });
  }

  private setupClientEventHandlers() {
    this.websocket.on('message', this.onClientMessage.bind(this));
    this.websocket.on('close', this.onClientCloseOrError.bind(this));
    this.websocket.on('error', this.onClientCloseOrError.bind(this));
  }

  private abortAllRequests() {
    for (const controller of this.activeAbortControllers) {
      controller.abort();
    }
    this.activeAbortControllers = [];
  }

  private createAbortController(): AbortController {
    const controller = new AbortController();
    this.activeAbortControllers.push(controller);
    return controller;
  }

  private filterAllSettledResults<T>(results: PromiseSettledResult<T | T[]>[]) {
    return results
      .filter((settled) => settled.status === 'fulfilled' && !!settled.value)
      .flatMap(
        (fulfilled) => (fulfilled as PromiseFulfilledResult<T | T[]>).value
      );
  }

  private findCountry(countryQuery: string | undefined) {
    if (!countryQuery) return null;

    return this.allCountries.find(
      ({ country_name }) =>
        country_name.toLowerCase() === countryQuery.toLowerCase()
    );
  }

  private filterSymbolList(symbolQuery: string | undefined) {
    if (!symbolQuery) return this.prevCountrySymbols;

    return this.prevCountrySymbols.filter((item) =>
      item.symbol.toLowerCase().includes(symbolQuery.toLowerCase())
    );
  }

  private calculatePagination<T>(
    dataArray: T[],
    page: number,
    perPage: number
  ) {
    const totalItems = dataArray.length;
    const totalPages = Math.ceil(totalItems / perPage);

    this.result.pagination.page = page;
    this.result.pagination.per_page = perPage;
    this.result.pagination.total_items = totalItems;
    this.result.pagination.total_pages = totalPages;
  }

  private sendToClient<T>(data: T) {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(data));
    }
  }

  private onClientCloseOrError() {
    this.abortAllRequests();
  }

  private async onClientMessage(chunk: RawData) {
    try {
      this.abortAllRequests();
      const req = JSON.parse(chunk.toString('utf-8')) as ClientFinnhubEvent;

      const {
        country_query = '',
        symbol_query = '',
        page = 1,
        per_page = 5,
      } = req;

      const country = this.findCountry(country_query);

      if (country.country_name !== this.prevCountry) {
        this.prevCountry = country.country_name;
        await this.getAllSymbolsByCountry(country);
      }

      const symbols = this.filterSymbolList(symbol_query);

      this.calculatePagination(symbols, page, per_page);
      await this.getStocks(symbols);

      this.sendToClient({
        type: 'done',
        data: {
          stock_data: this.result.stock_data,
          pagination: this.result.pagination,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      this.sendToClient({
        type: 'error',
        message: `Error processing request: ${errorMessage}`,
      });
    } finally {
      this.abortAllRequests();
    }
  }

  private async getListingByExchange(exchange: string, mic: string) {
    const controller = this.createAbortController();

    try {
      const { data } = await this.axios.get<Symbol[]>('/stock/symbol', {
        params: { exchange, mic },
        signal: controller.signal,
      });

      const index = this.activeAbortControllers.indexOf(controller);
      if (index > -1) {
        this.activeAbortControllers.splice(index, 1);
      }

      return data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return [];
      }
      if (error instanceof AxiosError) {
        this.sendToClient({
          type: 'error',
          message: error.response.data.error,
        });
      }

      return [];
    }
  }

  private async getAllSymbolsByCountry({
    country_name,
    entities,
  }: CountryExchangeData) {
    try {
      const results = await Promise.allSettled(
        entities.map(({ code, mic }) => this.getListingByExchange(code, mic))
      );

      const listingsData = this.filterAllSettledResults(results);

      this.prevCountrySymbols = listingsData.toSorted((a, b) =>
        a.symbol.localeCompare(b.symbol)
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        this.sendToClient({
          type: 'error',
          message: error.response.data.error,
        });
      } else {
        this.sendToClient({
          type: 'error',
          message: `Failed to fetch symbols for country ${country_name}`,
        });
      }
    }
  }

  private async getStockBySymbol(symbol: string) {
    const controller = this.createAbortController();
    const options: AxiosRequestConfig = {
      params: { symbol },
      signal: controller.signal,
    };

    try {
      const [quoteInfo, companyInfo] = await Promise.all([
        this.axios.get('/quote', options),
        this.axios.get('/stock/profile2', options),
      ]);

      const index = this.activeAbortControllers.indexOf(controller);

      if (index !== -1) {
        this.activeAbortControllers.splice(index, 1);
      }

      const quote = quoteInfo.data || {};
      const company = companyInfo.data || {};

      return {
        symbol,
        name: company.name,
        price: quote.c || 0,
        marketCap: company.marketCapitalization || 0,
        change: quote.d || 0,
        changePercent: quote.dp || 0,
      } as StockData;
    } catch (error) {
      if (axios.isCancel(error)) {
        return null;
      }
      this.sendToClient({
        type: 'error',
        message: `Failed to fetch data for symbol ${symbol}`,
      });
      return null;
    }
  }

  private async getStocks(symbolList: Symbol[]) {
    this.result.stock_data = [];
    const start =
      (this.result.pagination.page - 1) * this.result.pagination.per_page;
    const end = start + this.result.pagination.per_page;

    const symbolsToFetch = symbolList.slice(start, end);

    const results = await Promise.allSettled(
      symbolsToFetch.map((symbol) => this.getStockBySymbol(symbol.symbol))
    );
    this.result.stock_data = this.filterAllSettledResults(results);
  }
}
