import { useEffect, useState } from 'react';
import { useWS } from '../../shared/ws';
import { CryptoItem } from './CryptoItem';

type CMCCryptoItem = {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_1h: number;
    };
  };
};

export type CryptoData = CryptoItem[];

export function useCryptoPriceSubscribe() {
  const [data, setData] = useState<CryptoData>();

  const ws = useWS({ url: `ws://${location.hostname}:81` });

  useEffect(() => {
    if (ws !== undefined) {
      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data).data.data as CMCCryptoItem[];

          setData(
            data.map(
              ({
                id,
                name,
                symbol,
                quote: {
                  USD: { percent_change_1h, price },
                },
              }) => ({ id, name, symbol, price, percent_change_1h })
            )
          );
        } catch (e) {
          console.error(e);
        }
      };

      ws.addEventListener('message', messageHandler);

      return () => {
        ws.removeEventListener('message', messageHandler);
      };
    }
  }, [ws]);

  return data;
}
