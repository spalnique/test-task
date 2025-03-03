export type ExchangeEntity = { entity_name: string; code: string; mic: string };

export type CountryExchangeData = {
  country: string;
  entities: ExchangeEntity[];
};

export type ClientFinnhubEvent = {
  country_query: string;
  symbol_query: string;
  page: number;
  per_page: number;
};

export type Symbol = {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
};

export type StockData = {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  change: number;
  changePercent: number;
};

export type QueryResult = {
  stock_data: StockData[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};
