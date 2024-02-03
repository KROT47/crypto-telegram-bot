import { Module } from '@nestjs/common';
import { SignalsService } from './signals.service';
import { SignalsController } from './signals.controller';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [PricesModule],
  controllers: [SignalsController],
  providers: [SignalsService],
})
export class SignalsModule {}
