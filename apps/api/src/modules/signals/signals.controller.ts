import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { SignalsService } from './signals.service';

@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Post()
  create(@Body() createSignalDto: CreateSignalDto) {
    // eslint-disable-next-line
    console.log('>>>20', createSignalDto);

    return this.signalsService.create(createSignalDto);
  }

  @Get()
  findAll() {
    return this.signalsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSignalDto: UpdateSignalDto) {
    return this.signalsService.update(id, updateSignalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signalsService.remove(id);
  }
}
