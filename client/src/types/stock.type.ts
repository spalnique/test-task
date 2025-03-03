export type CountryExchanges = {
  country: string;
  entities: { entity_name: string; mic: string }[];
};

export type StockSymbol = {
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

export type PaginationState = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type ResponseData = {
  country_list: CountryExchanges[];
  symbol_list: StockSymbol[];
  stock_data: StockData[];
  pagination: PaginationState;
};

export type WebSocketResponse = {
  type: 'done' | 'error' | 'ready';
  data: ResponseData | Partial<ResponseData>;
  message?: string;
};
