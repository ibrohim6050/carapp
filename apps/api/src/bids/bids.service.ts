import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpsertBidDto } from './dto/upsert-bid.dto';

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  async upsert(loadId: string, carrierUserId: string, carrierCompanyId: string, dto: UpsertBidDto) {
    const load = await this.prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new NotFoundException('Load not found');
    if (new Date(load.biddingDeadlineAt) <= new Date()) throw new BadRequestException('Bidding closed');
    const bid = await this.prisma.bid.upsert({
      where: { loadId_carrierCompanyId: { loadId, carrierCompanyId } },
      update: { amountCurrency: dto.amountCurrency, amountValue: dto.amountValue, etaDays: dto.etaDays, comment: dto.comment },
      create: { loadId, carrierCompanyId, carrierUserId, amountCurrency: dto.amountCurrency, amountValue: dto.amountValue, etaDays: dto.etaDays, comment: dto.comment }
    });
    return { ok: true, id: bid.id, updatedAt: bid.updatedAt };
  }

  async myBid(loadId: string, carrierCompanyId: string) {
    return this.prisma.bid.findUnique({ where: { loadId_carrierCompanyId: { loadId, carrierCompanyId } } });
  }

  async listForCustomer(loadId: string, customerUserId: string, isAdmin: boolean) {
    const load = await this.prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new NotFoundException('Load not found');
    const now = new Date();
    if (!isAdmin) {
      if (load.customerId !== customerUserId) throw new ForbiddenException('Not your load');
      if (now < new Date(load.biddingDeadlineAt)) throw new ForbiddenException('Bids are sealed until deadline');
    }
    return this.prisma.bid.findMany({
      where: { loadId },
      select: { id: true, amountCurrency: true, amountValue: true, etaDays: true, comment: true, carrierCompanyId: true, createdAt: true, updatedAt: true },
      orderBy: [{ amountValue: 'asc' }, { createdAt: 'asc' }]
    });
  }
}
