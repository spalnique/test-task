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
  private prevSymbol: string = '';
  private requestedCountrySymbols: Symbol[] = [];
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

  private filterCountryList(countryQuery: string) {
    if (!countryQuery) return;

    return this.allCountries.filter(({ country }) =>
      country.toLowerCase().includes(countryQuery.toLowerCase())
    );
  }

  private filterSymbolList(symbolQuery: string) {
    if (!symbolQuery) return this.requestedCountrySymbols;

    return this.requestedCountrySymbols.filter((item) =>
      item.symbol.toLowerCase().includes(symbolQuery.toLowerCase())
    );
  }

  private calcStocksPagination<T>(stocksArray: T[]) {
    const totalItems = stocksArray.length;
    const totalPages = Math.ceil(totalItems / this.result.pagination.per_page);

    this.result.pagination.total_items = totalItems;
    this.result.pagination.total_pages = totalPages;
  }

  private updStocksPagination(page: number, perPage: number) {
    if (page) this.result.pagination.page = page;
    if (perPage) this.result.pagination.per_page = perPage;
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
      const { country_query = '', symbol_query = '', page, per_page } = req;

      this.updStocksPagination(page, per_page);

      const filteredCountries = this.filterCountryList(country_query);

      if (filteredCountries?.length === 1) {
        const [country] = filteredCountries;
        const isNewCountry = country.country !== this.prevCountry;

        if (isNewCountry) {
          this.prevCountry = country.country;
          this.prevSymbol = '';
          this.requestedCountrySymbols = [];
          await this.getAllSymbolsByCountry(country);
        }
      }

      if (this.requestedCountrySymbols.length > 0) {
        let symbolsToProcess = this.requestedCountrySymbols;
        if (symbol_query && this.prevSymbol !== symbol_query) {
          symbolsToProcess = this.filterSymbolList(symbol_query) || [];
          this.prevSymbol = symbol_query;
        }

        this.calcStocksPagination(symbolsToProcess);

        await this.getStocks(symbolsToProcess);
      }

      this.sendToClient({
        type: 'done',
        data: {
          stock_data: this.result.stock_data,
          pagination: this.result.pagination,
          symbol_count: this.requestedCountrySymbols.length,
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
    country,
    entities,
  }: CountryExchangeData) {
    try {
      const results = await Promise.allSettled(
        entities.map(({ code, mic }) => this.getListingByExchange(code, mic))
      );

      const listingsData = this.filterAllSettledResults(results);

      this.requestedCountrySymbols = listingsData.toSorted((a, b) =>
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
          message: `Failed to fetch symbols for country ${country}`,
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
