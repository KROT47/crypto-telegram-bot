import { useEffect, useState } from 'react';

function increaseUrlRetry(url: string) {
  const tmpUrl = new URL(url);
  const { search } = tmpUrl;
  const tmpSearch = new URLSearchParams(search);
  const retry = Number(tmpSearch.get('retry') ?? 0);
  tmpSearch.set('retry', `${retry + 1}`);
  tmpUrl.search = tmpSearch.toString();
  return tmpUrl.toString();
}

export function useWS(config: { url: string }): WebSocket | undefined {
  const [url, setUrl] = useState(config.url);
  const [ws, setWS] = useState<WebSocket>();

  useEffect(() => {
    console.log('WS connecting...');

    const newWS = new WebSocket(url);

    const handleOpen = () => {
      console.log('WS connected');
    };

    const handleError = (err: Event) => {
      console.log('WS error', err);
      newWS.close();
    };

    const handleClose = () => {
      console.log('WS disconnected');
      // reconnect
      setTimeout(() => setUrl(increaseUrlRetry(url)), 1000);
    };

    newWS.addEventListener('open', handleOpen);
    newWS.addEventListener('error', handleError);
    newWS.addEventListener('close', handleClose);

    setWS(newWS);

    return () => {
      newWS.removeEventListener('open', handleOpen);
      newWS.removeEventListener('error', handleError);
      newWS.removeEventListener('close', handleClose);

      newWS.close();
      setWS(undefined);

      console.log('WS disconnected');
    };
  }, [url]);

  return ws;
}
