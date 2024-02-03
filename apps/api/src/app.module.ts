import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import { SignalsModule } from './signals/signals.module';

@Module({
  imports: [ConfigModule.forRoot(), SignalsModule, PricesModule],
})
export class AppModule {}
