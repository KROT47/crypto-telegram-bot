export type TelegramBotNotificationConfig = {
  token: string;
  chat_id: number | string;
  message: string;
  parse_mode?: 'markdown' | 'html';
};

function getSendTelegramBotNotificationUrl({
  token,
  chat_id,
  message,
  parse_mode,
}: TelegramBotNotificationConfig): string {
  return `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(
    message
  )}&parse_mode=${parse_mode ?? 'markdown'}`;
}

async function handleFetchError(response: Response): Promise<Response> {
  if (response.ok === true) return response;
  const body = await response.json();
  console.error(body);
  return response;
}

export function sendTelegramBotNotification(
  config: TelegramBotNotificationConfig
) {
  const url = getSendTelegramBotNotificationUrl(config);
  return fetch(url).then(handleFetchError);
}
