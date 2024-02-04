import { DataIndex } from './DataIndex';
import { SignalData } from './SignalData';
import { SignalDto } from './SignalDto';
import { getSignalData } from './getSignalData';
import { sendBotNotification } from './sendBotNotification';

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

export function comparePrices({
  dataIndex,
  lastDataIndex,
  signalsMap,
}: {
  dataIndex: DataIndex;
  lastDataIndex: DataIndex | undefined;
  signalsMap: Map<SignalDto, SignalData | undefined>;
}) {
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
      signalsMap.set(signal, getSignalData(signal, dataIndex));
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
          sendBotNotification({ signal, prevPrice, price });

          shouldUpdateSignalData = true;
        }
      }

      if (shouldUpdateSignalData) {
        signalsMap.set(signal, getSignalData(signal, dataIndex));
      }
    }
  });
}
