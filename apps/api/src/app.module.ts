import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { LoadsModule } from './loads/loads.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [AuthModule, LoadsModule, BidsModule],
  providers: [PrismaService],
})
export class AppModule {}
