import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { PrismaService } from '../prisma.service';
import { LoadsService } from '../loads/loads.service';

@Module({ controllers: [BidsController], providers: [BidsService, PrismaService, LoadsService] })
export class BidsModule {}
