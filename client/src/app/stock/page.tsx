'use client';

import Loader from '@/components/Loader';
import StockTable from '@/components/StockTable';
import { useDebounceCall } from '@/hooks/useDebounceCall';
import {
  CountryExchanges,
  PaginationState,
  StockData,
  WebSocketResponse,
} from '@/types/stock.type';
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Pagination,
} from '@heroui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const initPagination: PaginationState = {
  page: 1,
  per_page: 5,
  total_pages: 0,
  total_items: 0,
};

export default function StockPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const wsRef = useRef<WebSocket | null>(null);

  const [isAPIReady, setIsAPIReady] = useState(false);
  const [countryList, setCountryList] = useState<CountryExchanges[]>([]);
  const [stockList, setStockList] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>(initPagination);

  const countrySelectedKey = useMemo(
    () =>
      countryList.find(({ country }) => {
        const queryStringValue = searchParams.get('country') || '';
        return country.toLowerCase() === queryStringValue.toLowerCase();
      })?.country || '',
    [searchParams, countryList]
  );

  const symbolDefaultValue = (searchParams.get('symbol') || '').toUpperCase();

  const updateQuery = useCallback(
    (queryObject: Record<string, string | number | null> | null) => {
      if (!queryObject) return pathname;
      const params = new URLSearchParams(searchParams.toString());
      Object.keys(queryObject).forEach((key) => {
        if (queryObject[key]) {
          params.set(key, queryObject[key].toString());
        } else {
          params.delete(key);
        }
      });

      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  const handleCountrySelection = (key: Key | null) => {
    if (key) {
      const query = { country: key.toString(), page: 1 };
      router.push(updateQuery(query));
    }
  };

  const debouncedInputChange = useDebounceCall((value: string) => {
    if (value) {
      const query = { symbol: value, page: 1 };
      router.push(updateQuery(query));
    }
  });

  const handlePageChange = (page: number) => {
    router.push(updateQuery({ page }));
  };

  const handleClearCountryInput = () => {
    router.push(updateQuery({ country: null, page: null, symbol: null }));
    setStockList([]);
    setPagination(initPagination);
  };

  const handleClearSymbolInput = () => {
    router.push(updateQuery({ page: 1, symbol: null }));
  };

  useEffect(() => {
    setIsLoading(true);
    wsRef.current = new WebSocket('ws://localhost:4001/stock');

    wsRef.current.onmessage = (event) => {
      try {
        const { data, type, message } = JSON.parse(
          event.data
        ) as WebSocketResponse;

        switch (type) {
          case 'ready':
            setCountryList(data.country_list || []);
            setIsAPIReady(true);
            setIsLoading(false);

          case 'done':
            if ('country_list' in data) {
              setCountryList(data.country_list as CountryExchanges[]);
            }

            if ('stock_data' in data) {
              setStockList(data.stock_data as StockData[]);
            }

            if ('pagination' in data) {
              setPagination(data.pagination as PaginationState);
            }
            setIsLoading(false);
            break;

          case 'error':
            if (message) {
              toast.error(`${message}`, { id: 'api error' });
            }
            setIsLoading(false);
            break;
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error parsing WebSocket message: ${error.message}`);
        } else {
          console.error(error);
        }
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };

    wsRef.current.onclose = () => {
      console.log('Disconnected from stock service');
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isAPIReady) return;
    setIsLoading(true);

    const params = Object.fromEntries(searchParams.entries());

    if (!Object.keys(params).length) {
      setIsLoading(false);
      return;
    }

    const json = JSON.stringify({
      ...params,
      country_query: params.country,
      symbol_query: params.symbol,
    });
    wsRef.current?.send(json);
  }, [searchParams, isAPIReady, updateQuery]);

  return (
    <>
      <div className="mx-auto flex w-full flex-col items-center gap-4 p-4">
        <div className="flex flex-col items-center gap-2">
          <Autocomplete
            className="dark w-[400px]"
            size="md"
            label="Country"
            labelPlacement="outside"
            selectedKey={countrySelectedKey}
            defaultItems={countryList}
            onSelectionChange={handleCountrySelection}
            clearButtonProps={{ onPress: handleClearCountryInput }}
            menuTrigger="input"
            popoverProps={{
              classNames: { content: 'bg-[#171717] max-h-64 overflow-auto' },
            }}
            isDisabled={!isAPIReady}
          >
            {({ country }) => (
              <AutocompleteItem key={country} className="dark">
                {country}
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Input
            className="dark w-[400px]"
            size="md"
            label="Symbol"
            labelPlacement="outside"
            defaultValue={symbolDefaultValue}
            description={`${pagination.total_items || 0} symbols found`}
            classNames={{ description: 'mx-auto', input: 'uppercase' }}
            onValueChange={debouncedInputChange}
            isDisabled={isLoading || !isAPIReady || !stockList.length}
            isClearable
            onClear={handleClearSymbolInput}
          />
        </div>

        <div className="relative w-full">
          {isLoading && <Loader />}
          {!!searchParams.toString().length && (
            <StockTable stocks={stockList} />
          )}
        </div>

        {stockList.length > 0 && pagination.total_pages > 1 && (
          <Pagination
            size="lg"
            className="dark"
            classNames={{ item: 'text-[10px]', cursor: 'text-[12px]' }}
            siblings={1}
            page={Number(searchParams.get('page')) || 1}
            total={pagination.total_pages}
            onChange={handlePageChange}
            initialPage={1}
            showControls
          />
        )}
      </div>
    </>
  );
}
