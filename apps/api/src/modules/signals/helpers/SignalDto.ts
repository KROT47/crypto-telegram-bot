import { CreateSignalDto } from '../dto/create-signal.dto';

export type SignalDto = CreateSignalDto & { id: string };
