import { Body, Controller, Get, Param, Post, Req, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { BidsService } from './bids.service';
import { UpsertBidDto } from './dto/upsert-bid.dto';

@Controller('loads/:loadId')
export class BidsController {
  constructor(private readonly bids: BidsService) {}

  @Post('bids')
  async upsert(@Req() req: Request, @Param('loadId') loadId: string, @Body() dto: UpsertBidDto) {
    if (req.identity?.role !== 'carrier') throw new ForbiddenException('Only carriers can bid');
    return this.bids.upsert(loadId, req.identity.userId, req.identity.companyId!, dto);
  }

  @Get('my-bid')
  async myBid(@Req() req: Request, @Param('loadId') loadId: string) {
    if (req.identity?.role !== 'carrier') throw new ForbiddenException('Only carriers');
    return this.bids.myBid(loadId, req.identity.companyId!);
  }

  @Get('bids')
  async listForCustomer(@Req() req: Request, @Param('loadId') loadId: string) {
    if (req.identity?.role !== 'customer' && req.identity?.role !== 'admin') throw new ForbiddenException('Only customers/admin');
    return this.bids.listForCustomer(loadId, req.identity!.userId, req.identity!.role === 'admin');
  }
}
