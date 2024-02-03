import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesModule } from './modules/prices/prices.module';
import { SignalsModule } from './modules/signals/signals.module';

@Module({
  imports: [ConfigModule.forRoot(), SignalsModule, PricesModule],
})
export class AppModule {}
