import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { PricesService } from '../prices/prices.service';

type SignalDto = CreateSignalDto & { id: string };

@Injectable()
export class SignalsService {
  private signals: SignalDto[] = [];
  private _unsubscribe: (() => void) | undefined;

  constructor(private readonly pricesService: PricesService) {}

  private comparePrices = () => {};

  private unsubscribe() {
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  private runPriceUpdates() {
    if (this._unsubscribe) return;

    this._unsubscribe = this.pricesService.subscribeForPriceUpdates(
      this.comparePrices
    );
  }

  create(createSignalDto: CreateSignalDto) {
    this.signals.push({
      id: uuidv4(),
      ...createSignalDto,
    });

    this.runPriceUpdates();
  }

  findAll() {
    return this.signals.reverse();
  }

  update(updateId: string, updateSignalDto: UpdateSignalDto) {
    const signal = this.signals.find(({ id }) => id === updateId);
    if (signal) Object.assign(signal, updateSignalDto);
  }

  remove(removeId: string) {
    const index = this.signals.findIndex(({ id }) => id === removeId);
    if (index !== -1) this.signals.splice(index, 1);

    if (this.signals.length === 0) this.unsubscribe();
  }
}
