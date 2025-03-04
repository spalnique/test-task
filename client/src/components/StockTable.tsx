import { formatOutput } from '@/lib/utils/format';
import { StockData } from '@/types/stock.type';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'table'> & { stocks: StockData[] };

export default function StockTable({ stocks }: Props) {
  return (
    <Table
      aria-label="Stocks table"
      classNames={{
        wrapper: 'dark h-[260px] w-full',
      }}
    >
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>Symbol</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Capitalization</TableColumn>
        <TableColumn>Price</TableColumn>
        <TableColumn>Price change per day</TableColumn>
        <TableColumn>Price change per month</TableColumn>
      </TableHeader>
      <TableBody emptyContent="Nothing found">
        {stocks.map((stock, i) => (
          <TableRow key={stock.symbol}>
            <TableCell>{i + 1}</TableCell>
            <TableCell className="font-bold">{stock.symbol}</TableCell>
            <TableCell>{stock.name ?? 'n/a'}</TableCell>
            <TableCell>{formatOutput.marketCap(stock.marketCap)}</TableCell>
            <TableCell>{formatOutput.price(stock.price)}</TableCell>
            <TableCell
              className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}
              align="center"
            >
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)}
            </TableCell>
            <TableCell
              className={
                stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }
              align="center"
            >
              {stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
