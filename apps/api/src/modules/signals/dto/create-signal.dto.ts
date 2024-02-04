import { getTelegramBotToken } from 'apps/api/src/entities/telegramWebApp';
import { IsValidTelegramInitData } from 'apps/api/src/shared/telegramWebApp';
import { IsEmpty, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSignalDto {
  @IsEmpty()
  chat_id: number;

  @IsNotEmpty()
  @IsString()
  @IsValidTelegramInitData(getTelegramBotToken)
  initData: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsIn(['price', 'percent'])
  type: 'price' | 'percent';

  @IsNumber()
  delta: number;

  @IsNotEmpty()
  @IsNumber()
  timeFrame: number;
}
