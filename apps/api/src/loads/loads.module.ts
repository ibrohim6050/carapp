import { Module } from '@nestjs/common';
import { LoadsService } from './loads.service';
import { LoadsController } from './loads.controller';
import { PrismaService } from '../prisma.service';

@Module({ controllers: [LoadsController], providers: [LoadsService, PrismaService], exports: [LoadsService] })
export class LoadsModule {}
