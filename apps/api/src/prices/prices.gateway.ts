import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PricesService } from './prices.service';
import { WebSocket } from 'ws';

@WebSocketGateway(81)
export class PricesGateway {
  wsClientsMap = new Map<WebSocket, () => void>();

  constructor(private readonly pricesService: PricesService) {}

  @SubscribeMessage('init')
  handleEvent(client: WebSocket, data: string): string {
    return data;
  }

  handleConnection(client: WebSocket, ...args: any[]): any {
    const unsubscribe = this.pricesService.subscribeForPriceUpdates(data => {
      client.send(
        JSON.stringify({
          type: 'priceUpdate',
          data,
        })
      );
    });

    this.wsClientsMap.set(client, unsubscribe);

    // @ts-ignore
    console.log('Client connected', this.wsClientsMap.size);
  }

  handleDisconnect(client: WebSocket, ...args: any[]): any {
    const unsubscribe = this.wsClientsMap.get(client);
    this.wsClientsMap.delete(client);
    unsubscribe?.();
    console.log('Client disconnected');
  }
}
