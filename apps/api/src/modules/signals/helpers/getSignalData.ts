import { DataIndex } from './DataIndex';
import { SignalData } from './SignalData';
import { SignalDto } from './SignalDto';

export function getSignalData(
  signal: SignalDto,
  dataIndex: DataIndex | undefined
): SignalData | undefined {
  return dataIndex?.[signal.symbol];
}
