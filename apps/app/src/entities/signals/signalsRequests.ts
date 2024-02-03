import { webApp } from '../webApp';
import { signalsUrl } from './signalsUrl';

export type SignalFormData = {
  symbol: string;
  type: string;
  delta: number;
  timeFrame: number;
};

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function prepareSignalData(formData: SignalFormData) {
  return JSON.stringify({
    initData: webApp.initData,
    ...formData,
  });
}

async function handleFetchError(response: Response): Promise<Response> {
  if (response.ok === true) return response;
  const body = await response.json();
  throw new Error(body.message[0]);
}

export function createSignalRequest(formData: SignalFormData) {
  return fetch(signalsUrl, {
    method: 'post',
    headers,
    body: prepareSignalData(formData),
  }).then(handleFetchError);
}

export function updateSignalRequest(
  signalId: string,
  formData: SignalFormData
) {
  const url = new URL(signalsUrl);
  url.pathname += `/${signalId}`;

  return fetch(url, {
    method: 'put',
    headers,
    body: prepareSignalData(formData),
  }).then(handleFetchError);
}

export const deleteSignalRequest = (signalId: string) => {
  const url = new URL(signalsUrl);
  url.pathname += `/${signalId}`;

  return fetch(url, { method: 'delete', headers });
};
