import { useEffect, useState } from 'react';
import { Signal } from './Signal';
import { getSignalsRequest } from './signalsRequests';

export function useSignals(retry: number): Signal[] {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const signal = controller.signal;
        const response = await getSignalsRequest({ signal });
        const data = await response.json();
        setSignals(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [retry]);

  return signals;
}
