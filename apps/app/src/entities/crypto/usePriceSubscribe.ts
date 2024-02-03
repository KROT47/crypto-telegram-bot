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

const { VITE_API_WS_ORIGIN } = import.meta.env;

if (VITE_API_WS_ORIGIN === undefined) {
  throw Error('VITE_API_WS_ORIGIN env var is not defined');
}

export function useCryptoPriceSubscribe() {
  const [data, setData] = useState<CryptoData>();

  const ws = useWS({ url: VITE_API_WS_ORIGIN });

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
