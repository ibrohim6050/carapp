import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoadStatus } from '@prisma/client';

@Injectable()
export class LoadsService {
  constructor(private prisma: PrismaService) {}

  async createLoad(user: any, dto: any) {
    if (user.role !== 'customer') throw new ForbiddenException('Only customers can create loads');
    const data = {
      customerId: user.userId,
      title: dto.title,
      cargoType: dto.cargoType,
      weightTons: dto.weightTons,
      pickupAddr: dto.pickupAddr,
      deliveryAddr: dto.deliveryAddr,
      customsPoint: dto.customsPoint,
      targetDate: new Date(dto.targetDate),
      notes: dto.notes ?? null,
      biddingDeadlineAt: new Date(dto.biddingDeadlineAt),
      status: dto.status ?? LoadStatus.open,
    };
    return this.prisma.load.create({ data });
  }

  async listLoads(user: any, status?: string, mine?: string) {
    const where: any = {};
    if (status) where.status = status as LoadStatus;
    if (mine === 'true') {
      if (user.role === 'customer') where.customerId = user.userId;
      if (user.role === 'carrier') where.status = LoadStatus.open;
    } else {
      if (user.role === 'carrier' && !status) where.status = LoadStatus.open;
    }
    return this.prisma.load.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getLoad(user: any, id: string) {
    const load = await this.prisma.load.findUnique({ where: { id } });
    if (!load) throw new NotFoundException('Load not found');
    return load;
  }

  async award(user: any, loadId: string, bidId: string) {
    if (user.role !== 'customer') throw new ForbiddenException('Only customers can award');
    const load = await this.prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new NotFoundException('Load not found');
    if (load.customerId !== user.userId) throw new ForbiddenException('Only owner can award');
    if (load.status !== LoadStatus.open) throw new BadRequestException('Load is not open');
    const bid = await this.prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid || bid.loadId !== loadId) throw new BadRequestException('Invalid bid');
    return this.prisma.load.update({ where: { id: loadId }, data: { status: LoadStatus.awarded, awardedBidId: bidId } });
  }
}
