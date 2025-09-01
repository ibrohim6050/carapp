import { Module } from '@nestjs/common';
import { LoadsService } from './loads.service';
import { LoadsController } from './loads.controller';
import { PrismaService } from '../prisma/prisma.service';
@Module({ providers: [PrismaService, LoadsService], controllers: [LoadsController] })
export class LoadsModule {}
