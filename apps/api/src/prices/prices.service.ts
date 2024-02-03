import { Injectable } from '@nestjs/common';
import { CMCData, PricesAPI, getPriceAPI } from 'packages/price-api';

export type PriceUpdateHandler = (data: CMCData) => void;

@Injectable()
export class PricesService {
  private handlers: PriceUpdateHandler[] = [];
  private pricesAPI: PricesAPI;
  private _unsubscribe: (() => void) | undefined;

  constructor() {
    const { COINMARKETCAP_TOKEN, COINMARKETCAP_POLL_INTERVAL } = process.env;

    if (COINMARKETCAP_TOKEN === undefined) {
      throw Error('COINMARKETCAP_TOKEN is not defined in env');
    }

    const pollIntervalMs = COINMARKETCAP_POLL_INTERVAL
      ? Number(COINMARKETCAP_POLL_INTERVAL)
      : 5000;
    this.pricesAPI = getPriceAPI(COINMARKETCAP_TOKEN, { pollIntervalMs });
  }

  private unsubscribe() {
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  private runPriceUpdates() {
    if (this._unsubscribe) return;

    this._unsubscribe = this.pricesAPI.priceSubscribe(data => {
      this.handlers.forEach(handler => handler(data));
    });
  }

  subscribeForPriceUpdates(handler: PriceUpdateHandler): () => void {
    this.handlers.push(handler);
    this.runPriceUpdates();

    return () => {
      const index = this.handlers.indexOf(handler);
      if (index !== -1) this.handlers.splice(index, 1);
      if (this.handlers.length === 0) this.unsubscribe();
    };
  }
}
