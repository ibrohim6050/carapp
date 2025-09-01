import { Body, Controller, Get, Param, Post, Query, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';

@Controller('loads')
export class LoadsController {
  constructor(private readonly loads: LoadsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateLoadDto) {
    if (req.identity?.role !== 'customer') throw new ForbiddenException('Only customers can create loads');
    return this.loads.create(req.identity.userId, dto);
  }

  @Get()
  async list(@Query('status') status?: string) { return this.loads.list(status as any); }

  @Get(':id')
  async get(@Param('id') id: string) {
    const load = await this.loads.get(id);
    if (!load) throw new NotFoundException('Load not found');
    return load;
  }

  @Post(':id/award')
  async award(@Req() req: Request, @Param('id') id: string, @Body() body: { bidId: string }) {
    if (req.identity?.role !== 'customer') throw new ForbiddenException('Only customers can award');
    return this.loads.award(req.identity.userId, id, body.bidId);
  }
}
