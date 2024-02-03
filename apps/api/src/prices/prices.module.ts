import { Module } from '@nestjs/common';
import { PricesGateway } from './prices.gateway';
import { PricesService } from './prices.service';

@Module({
  providers: [PricesGateway, PricesService],
  exports: [PricesService],
})
export class PricesModule {}
