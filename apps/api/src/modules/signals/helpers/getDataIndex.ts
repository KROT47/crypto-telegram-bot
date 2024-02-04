import { CMCData } from 'packages/price-api';
import { DataIndex } from './DataIndex';

export function getDataIndex({
  status: { timestamp: tsStr },
  data,
}: CMCData): DataIndex {
  const ts = new Date(tsStr).getTime();
  return data.reduce<DataIndex>(
    (
      acc,
      {
        symbol,
        quote: {
          USD: { price },
        },
      }
    ) => {
      acc[symbol] = { ts, price };
      return acc;
    },
    {}
  );
}
