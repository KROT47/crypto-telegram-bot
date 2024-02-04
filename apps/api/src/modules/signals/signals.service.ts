import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { PricesService } from '../prices/prices.service';
import { CMCData } from 'packages/price-api';
import { formatPercent, formatPrice } from '../../shared/utils';
import { parseInitData } from '@tma.js/sdk';
import { sendTelegramBotNotification } from '../../shared/telegramWebApp';
import { getTelegramBotToken } from '../../entities/telegramWebApp';

type SignalDto = CreateSignalDto & { id: string };
type SignalData = {
  ts: number;
  price: number;
};

type ItemData = {
  ts: number;
  price: number;
};

type DataIndex = Record<string, ItemData>;

function getDataIndex({
  status: { timestamp: tsStr },
  data,
}: CMCData): DataIndex {
  const ts = new Date(tsStr).getTime();
  return data.reduce<DataIndex>(
    (
      acc,
      {
        symbol,
        quote: {
          USD: { price },
        },
      }
    ) => {
      acc[symbol] = { ts, price };
      return acc;
    },
    {}
  );
}

// add 1 second for each minute as error prone buffer between comparing of timestamps
// 'border' means that time delta reached the border of time frame
const allowedErrorPerMinuteMs = 1000;
function isInTimeFrame(
  timeFrameInMinutes: number,
  prevTs: number,
  ts: number
): 'yes' | 'no' | 'border' {
  const timeDelta = ts - prevTs;
  const deltaMS = timeDelta - timeFrameInMinutes * 60 * 1000;
  if (deltaMS <= 0) return 'yes';
  const allowedErrorMS = timeFrameInMinutes * allowedErrorPerMinuteMs;
  return deltaMS > allowedErrorMS ? 'no' : 'border';
}

@Injectable()
export class SignalsService {
  private signals: SignalDto[] = [];
  private signalsMap = new Map<SignalDto, SignalData | undefined>();
  private lastDataIndex: DataIndex | undefined;
  private _unsubscribe: (() => void) | undefined;

  constructor(private readonly pricesService: PricesService) {}

  private comparePrices = (dataIndex: DataIndex) => {
    const { lastDataIndex, signalsMap } = this;

    if (lastDataIndex === undefined || signalsMap.size === 0) return;

    signalsMap.forEach((signalData, signal) => {
      const lastItemData = lastDataIndex[signal.symbol];
      const itemData = dataIndex[signal.symbol];

      if (
        signalData === undefined ||
        lastItemData === undefined ||
        itemData === undefined
      ) {
        // init signal with data
        signalsMap.set(signal, this.getSignalData(signal, dataIndex));
      } else {
        const { symbol, delta, timeFrame, type, chat_id } = signal;
        const { ts: prevTs, price: prevPrice } = signalData;
        const { ts, price } = itemData;

        const timeFrameTestResult = isInTimeFrame(timeFrame, prevTs, ts);

        let shouldUpdateSignalData = timeFrameTestResult !== 'yes';

        if (timeFrameTestResult !== 'no') {
          // compare prices
          const priceDelta = price - prevPrice;
          const percentDelta = priceDelta / prevPrice;

          if (
            (type === 'price' && Math.abs(priceDelta) > delta) ||
            (type === 'percent' && Math.abs(percentDelta) > delta)
          ) {
            sendTelegramBotNotification({
              chat_id,
              message: [
                `**${symbol}** price change: **${
                  type === 'price'
                    ? formatPrice(priceDelta)
                    : formatPercent(percentDelta)
                }** (${
                  type === 'price'
                    ? formatPercent(percentDelta)
                    : formatPrice(priceDelta)
                })`,
                `------------------------`,
                `Triggered by signal: ${symbol} - ${
                  type === 'price' ? formatPrice(delta) : formatPercent(delta)
                } - ${timeFrame} min`,
              ].join('\n'),
              token: getTelegramBotToken(),
              parse_mode: 'markdown',
            });

            shouldUpdateSignalData = true;
          }
        }

        if (shouldUpdateSignalData) {
          signalsMap.set(signal, this.getSignalData(signal, dataIndex));
        }
      }
    });
  };

  private unsubscribe() {
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  private runPriceUpdates() {
    if (this._unsubscribe) return;

    this._unsubscribe = this.pricesService.subscribeForPriceUpdates(data => {
      const newDataIndex = getDataIndex(data);
      this.comparePrices(newDataIndex);
      this.lastDataIndex = newDataIndex;
    });
  }

  private getSignalData(
    signal: SignalDto,
    dataIndex: DataIndex | undefined
  ): SignalData | undefined {
    return dataIndex?.[signal.symbol];
  }

  create(createSignalDto: CreateSignalDto) {
    this.runPriceUpdates();

    const data = parseInitData(createSignalDto.initData);
    const chat_id = data.user?.id as number;

    const signal = {
      ...createSignalDto,
      id: uuidv4(),
      chat_id,
    };
    this.signals.push(signal);

    this.signalsMap.set(signal, this.getSignalData(signal, this.lastDataIndex));
  }

  findAll() {
    return this.signals.reverse();
  }

  update(updateId: string, updateSignalDto: UpdateSignalDto) {
    const signal = this.signals.find(({ id }) => id === updateId);
    if (!signal) return;

    Object.assign(signal, updateSignalDto);
    this.signalsMap.set(signal, this.getSignalData(signal, this.lastDataIndex));
  }

  remove(removeId: string) {
    const index = this.signals.findIndex(({ id }) => id === removeId);
    if (index !== -1) this.signals.splice(index, 1);

    if (this.signals.length === 0) this.unsubscribe();
  }
}
