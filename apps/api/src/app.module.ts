import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { LoadsModule } from './loads/loads.module';
import { BidsModule } from './bids/bids.module';
import { IdentityMiddleware } from './common/identity.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    LoadsModule,
    BidsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IdentityMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
