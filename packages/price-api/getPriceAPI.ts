export type CMCStatus = {
  timestamp: string;
};

export type CMCItem = {
  id: number;
  symbol: string;
  quote: {
    USD: {
      price: number;
    };
  };
};

export type CMCData = {
  status: CMCStatus;
  data: CMCItem[];
};

type Handler = (data: CMCData) => void;

export type PricesAPI = {
  priceSubscribe: (handler: Handler) => () => void;
};

type PricesAPIConfig = {
  pollIntervalMs?: number;
};

const fetchUrl =
  'https://pro-api.coinMarketCap.com/v1/cryptocurrency/listings/latest';

export function getPriceAPI(
  token: string,
  { pollIntervalMs = 1000 }: PricesAPIConfig = {}
): PricesAPI {
  const handlers: Handler[] = [];
  let isRunning = false;

  const runPriceFetch = async () => {
    if (!isRunning && handlers.length > 0) {
      isRunning = true;

      console.log('fetching coinmarketcap...');

      const response = await fetch(fetchUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': token,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.error(
          'CoinMarketCap Error:',
          `${response.status} ${response.statusText}`
        );
      } else {
        const data = await response.json();

        handlers.forEach(handler => handler(data));

        setTimeout(() => {
          isRunning = false;
          runPriceFetch();
        }, pollIntervalMs);
      }
    }
  };

  return {
    priceSubscribe(handler) {
      handlers.push(handler);
      runPriceFetch();

      return () => {
        const index = handlers.findIndex(h => h === handler);

        if (index !== -1) handlers.splice(index, 1);
      };
    },
  };
}
