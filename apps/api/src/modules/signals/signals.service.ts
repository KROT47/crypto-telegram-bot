import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { parseInitData } from '@tma.js/sdk';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getUserId } from '../../entities/auth';
import { PricesService } from '../prices/prices.service';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import {
  DataIndex,
  SignalData,
  SignalDto,
  comparePrices,
  getDataIndex,
  getSignalData,
} from './helpers';

@Injectable({ scope: Scope.REQUEST })
export class SignalsService {
  private signals: SignalDto[] = [];
  private signalsMap = new Map<SignalDto, SignalData | undefined>();
  private lastDataIndex: DataIndex | undefined;
  private _unsubscribe: (() => void) | undefined;

  constructor(
    private readonly pricesService: PricesService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  private get userId() {
    return getUserId(this.request);
  }

  private comparePrices(dataIndex: DataIndex) {
    const { lastDataIndex, signalsMap } = this;
    comparePrices({ dataIndex, lastDataIndex, signalsMap });
  }

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

    this.signalsMap.set(signal, getSignalData(signal, this.lastDataIndex));
  }

  findAll() {
    this.userId;

    return this.signals.reverse();
  }

  update(updateId: string, updateSignalDto: UpdateSignalDto) {
    const signal = this.signals.find(({ id }) => id === updateId);
    if (!signal) return;

    Object.assign(signal, updateSignalDto);
    this.signalsMap.set(signal, getSignalData(signal, this.lastDataIndex));
  }

  remove(removeId: string) {
    const index = this.signals.findIndex(({ id }) => id === removeId);
    if (index !== -1) this.signals.splice(index, 1);

    if (this.signals.length === 0) this.unsubscribe();
  }
}
