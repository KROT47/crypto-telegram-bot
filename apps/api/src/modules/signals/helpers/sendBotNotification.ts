import { sendTelegramBotNotification } from 'apps/api/src/shared/telegramWebApp';
import { CreateSignalDto } from '../dto/create-signal.dto';
import { getTelegramBotToken } from 'apps/api/src/entities/telegramWebApp';
import { formatPercent, formatPrice } from 'apps/api/src/shared/utils';

export function sendBotNotification({
  signal,
  price,
  prevPrice,
}: {
  signal: CreateSignalDto;
  price: number;
  prevPrice: number;
}) {
  const priceDelta = price - prevPrice;
  const percentDelta = priceDelta / prevPrice;
  const { symbol, delta, timeFrame, type, chat_id } = signal;
  sendTelegramBotNotification({
    chat_id,
    message: [
      `**${symbol}** price change: **${
        type === 'price' ? formatPrice(priceDelta) : formatPercent(percentDelta)
      }** (${
        type === 'price' ? formatPercent(percentDelta) : formatPrice(priceDelta)
      })`,
      `Current Price: ${formatPrice(price)}`,
      `------------------------`,
      `Triggered by signal: ${symbol} - ${
        type === 'price' ? formatPrice(delta) : formatPercent(delta)
      } - ${timeFrame} min`,
    ].join('\n'),
    token: getTelegramBotToken(),
    parse_mode: 'markdown',
  });
}
