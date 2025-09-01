import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}
  async upsertBid(user: any, loadId: string, amountValue: number, comment?: string, etaDays?: number) {
    if (user.role !== 'carrier') throw new ForbiddenException('Only carriers can bid');
    const load = await this.prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new NotFoundException('Load not found');
    if (!user.companyId) throw new ForbiddenException('Carrier must belong to a company');
    if (new Date() >= new Date(load.biddingDeadlineAt)) throw new BadRequestException('Bidding deadline passed');
    return this.prisma.bid.upsert({
      where: { loadId_carrierCompanyId: { loadId, carrierCompanyId: user.companyId } },
      update: { amountValue, comment, etaDays },
      create: { loadId, carrierCompanyId: user.companyId, carrierUserId: user.userId, amountValue, comment, etaDays },
    });
  }
  async myBid(user: any, loadId: string) {
    if (user.role !== 'carrier') throw new ForbiddenException();
    if (!user.companyId) throw new ForbiddenException('Carrier must belong to a company');
    const bid = await this.prisma.bid.findUnique({ where: { loadId_carrierCompanyId: { loadId, carrierCompanyId: user.companyId } } });
    if (!bid) throw new NotFoundException('No bid'); return bid;
  }
  async listBids(user: any, loadId: string) {
    const load = await this.prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new NotFoundException('Load not found');
    const now = new Date();
    const isOwner = user.role === 'customer' && user.userId === load.customerId;
    const isAdmin = user.role === 'admin';
    if (now < new Date(load.biddingDeadlineAt) && !isAdmin) throw new ForbiddenException('Bids are sealed until deadline');
    if (!isOwner && !isAdmin) throw new ForbiddenException('Only owner or admin can view all bids');
    return this.prisma.bid.findMany({ where: { loadId }, orderBy: { amountValue: 'asc' } });
  }
}
