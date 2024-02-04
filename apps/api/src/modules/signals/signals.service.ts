import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
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
import { getTelegramBotToken } from '../../entities/telegramWebApp';

type State = {
  signals: SignalDto[];
  signalsMap: Map<SignalDto, SignalData | undefined>;
  lastDataIndex: DataIndex | undefined;
  _unsubscribe: (() => void) | undefined;
};

const state: State = {
  signals: [],
  signalsMap: new Map<SignalDto, SignalData | undefined>(),
  lastDataIndex: undefined,
  _unsubscribe: undefined,
};

function unsubscribe() {
  state._unsubscribe?.();
  state._unsubscribe = undefined;
}

@Injectable({ scope: Scope.REQUEST })
export class SignalsService {
  constructor(
    private readonly pricesService: PricesService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  private get userId() {
    return getUserId(this.request, getTelegramBotToken());
  }

  private comparePrices(dataIndex: DataIndex) {
    const { lastDataIndex, signalsMap } = state;
    comparePrices({ dataIndex, lastDataIndex, signalsMap });
  }

  private runPriceUpdates() {
    if (state._unsubscribe) return;

    state._unsubscribe = this.pricesService.subscribeForPriceUpdates(data => {
      const newDataIndex = getDataIndex(data);
      this.comparePrices(newDataIndex);
      state.lastDataIndex = newDataIndex;
    });
  }

  private checkAuthorisedAndReturnChatId() {
    const chat_id = this.userId;
    if (chat_id === undefined) throw new Error('Unauthenticated');
    return chat_id;
  }

  create(createSignalDto: CreateSignalDto) {
    const chat_id = this.checkAuthorisedAndReturnChatId();

    this.runPriceUpdates();

    const signal = {
      ...createSignalDto,
      id: uuidv4(),
      chat_id,
    };
    state.signals.push(signal);

    state.signalsMap.set(signal, getSignalData(signal, state.lastDataIndex));
  }

  findAll() {
    const chat_id = this.userId;

    return state.signals
      .filter(({ chat_id: ch_id }) => ch_id === chat_id)
      .reverse();
  }

  update(updateId: string, updateSignalDto: UpdateSignalDto) {
    const chat_id = this.checkAuthorisedAndReturnChatId();

    const signal = state.signals.find(
      ({ id, chat_id: ch_id }) => id === updateId && ch_id === chat_id
    );
    if (!signal) return;

    Object.assign(signal, updateSignalDto);
    state.signalsMap.set(signal, getSignalData(signal, state.lastDataIndex));
  }

  remove(removeId: string) {
    const chat_id = this.checkAuthorisedAndReturnChatId();

    const index = state.signals.findIndex(
      ({ id, chat_id: ch_id }) => id === removeId && ch_id === chat_id
    );
    if (index !== -1) state.signals.splice(index, 1);

    if (state.signals.length === 0) unsubscribe();
  }
}
