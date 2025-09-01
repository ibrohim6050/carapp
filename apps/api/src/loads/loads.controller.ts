import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';

@UseGuards(JwtAuthGuard)
@Controller('loads')
export class LoadsController {
  constructor(private loads: LoadsService) {}
  @Post() create(@Req() req: any, @Body() body: CreateLoadDto) { return this.loads.createLoad(req.user, body); }
  @Get()  list(@Req() req: any, @Query('status') status?: string, @Query('mine') mine?: string) { return this.loads.listLoads(req.user, status, mine); }
  @Get(':id') detail(@Req() req: any, @Param('id') id: string) { return this.loads.getLoad(req.user, id); }
  @Post(':id/award') award(@Req() req: any, @Param('id') id: string, @Body('bidId') bidId: string) { return this.loads.award(req.user, id, bidId); }
}
