export function getTelegramBotToken() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (TELEGRAM_BOT_TOKEN === undefined) {
    throw Error('TELEGRAM_BOT_TOKEN is not defined in env');
  }
  return TELEGRAM_BOT_TOKEN;
}
