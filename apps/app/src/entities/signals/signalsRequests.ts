import { webApp } from '../webApp';
import { signalsUrl } from './signalsUrl';

export type SignalFormData = {
  symbol: string;
  type: string;
  delta: number;
  timeFrame: number;
};

function getRequestOptions({
  headers,
  ...options
}: RequestInit = {}): RequestInit {
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
      token: webApp.initData,
    },
    ...options,
  };
}

function prepareSignalData(formData: SignalFormData) {
  return JSON.stringify({
    ...formData,
  });
}

async function handleFetchError(response: Response): Promise<Response> {
  if (response.ok === true) return response;
  const body = await response.json();
  throw new Error(body.message[0]);
}

export function getSignalsRequest(options: RequestInit) {
  return fetch(signalsUrl, getRequestOptions(options)).then(handleFetchError);
}

export function createSignalRequest(formData: SignalFormData) {
  return fetch(
    signalsUrl,
    getRequestOptions({
      method: 'post',
      body: prepareSignalData(formData),
    })
  ).then(handleFetchError);
}

export function updateSignalRequest(
  signalId: string,
  formData: SignalFormData
) {
  const url = new URL(signalsUrl);
  url.pathname += `/${signalId}`;

  return fetch(
    url,
    getRequestOptions({
      method: 'put',
      body: prepareSignalData(formData),
    })
  ).then(handleFetchError);
}

export const deleteSignalRequest = (signalId: string) => {
  const url = new URL(signalsUrl);
  url.pathname += `/${signalId}`;

  return fetch(url, getRequestOptions({ method: 'delete' }));
};
