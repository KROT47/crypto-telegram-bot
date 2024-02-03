import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSignalDto {
  @IsNotEmpty()
  @IsString()
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
