import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { LoadStatus } from '@prisma/client';

@Injectable()
export class LoadsService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CreateLoadDto) {
    if (new Date(dto.biddingDeadlineAt) <= new Date()) throw new BadRequestException('Bidding deadline must be in the future');
    return this.prisma.load.create({
      data: {
        customerId,
        title: dto.title, cargoType: dto.cargoType, weightTons: dto.weightTons,
        pickupAddr: dto.pickupAddr, deliveryAddr: dto.deliveryAddr, customsPoint: dto.customsPoint,
        targetDate: new Date(dto.targetDate), notes: dto.notes,
        biddingDeadlineAt: new Date(dto.biddingDeadlineAt),
        status: dto.status ?? LoadStatus.open,
      },
    });
  }

  async list(status?: LoadStatus) {
    return this.prisma.load.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, cargoType: true, weightTons: true,
        pickupAddr: true, deliveryAddr: true, customsPoint: true,
        targetDate: true, biddingDeadlineAt: true, status: true, createdAt: true
      }
    });
  }

  async get(id: string) {
    return this.prisma.load.findUnique({ where: { id }, include: { awardedBid: true } });
  }

  async award(customerId: string, loadId: string, bidId: string) {
    const load = await this.prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new NotFoundException('Load not found');
    if (load.customerId !== customerId) throw new BadRequestException('Not your load');
    if (new Date() < new Date(load.biddingDeadlineAt)) throw new BadRequestException('Cannot award before bidding deadline');
    await this.prisma.bid.findFirstOrThrow({ where: { id: bidId, loadId } });
    return this.prisma.load.update({ where: { id: loadId }, data: { status: LoadStatus.awarded, awardedBidId: bidId } });
  }
}
