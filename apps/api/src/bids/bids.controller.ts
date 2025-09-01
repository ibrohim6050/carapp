import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BidsService } from './bids.service';

@UseGuards(JwtAuthGuard)
@Controller('loads/:loadId')
export class BidsController {
  constructor(private bids: BidsService) {}
  @Post('bids') upsert(@Req() req: any, @Param('loadId') loadId: string, @Body('amountValue') amountValue: number, @Body('comment') comment?: string, @Body('etaDays') etaDays?: number) {
    return this.bids.upsertBid(req.user, loadId, Number(amountValue), comment, etaDays ? Number(etaDays) : undefined);
  }
  @Get('my-bid') mine(@Req() req: any, @Param('loadId') loadId: string) { return this.bids.myBid(req.user, loadId); }
  @Get('bids') list(@Req() req: any, @Param('loadId') loadId: string) { return this.bids.listBids(req.user, loadId); }
}
