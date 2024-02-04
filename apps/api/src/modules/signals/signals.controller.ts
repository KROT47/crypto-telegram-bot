import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';

import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { SignalsService } from './signals.service';
import { Response } from 'express';

function tryAuthorized(res: Response, cb: () => unknown) {
  try {
    res.status(200);
    res.send(cb());
  } catch (e) {
    res.status(403);
    res.send({ message: ['Not authorized'] });
  }
}

@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Post()
  create(@Res() res: Response, @Body() createSignalDto: CreateSignalDto) {
    return tryAuthorized(res, () =>
      this.signalsService.create(createSignalDto)
    );
  }

  @Get()
  findAll() {
    return this.signalsService.findAll();
  }

  @Put(':id')
  update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateSignalDto: UpdateSignalDto
  ) {
    return tryAuthorized(res, () =>
      this.signalsService.update(id, updateSignalDto)
    );
  }

  @Delete(':id')
  remove(@Res() res: Response, @Param('id') id: string) {
    return tryAuthorized(res, () => this.signalsService.remove(id));
  }
}
