import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit_logs/audit.service';
import { AuditAction } from '@prisma/client';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit_logs/audit.module';

@Injectable()
export class StatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateStateDto, userId?: number) {
    const state = await this.prisma.state.create({ data: dto });
    await this.audit.log(userId || null, 'State', state.id, AuditAction.CREATE, null, state);
    return state;
  }

  async findAll() {
    return this.prisma.state.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const state = await this.prisma.state.findUnique({ where: { id } });
    if (!state) throw new NotFoundException(`State ${id} not found`);
    return state;
  }

  async update(id: number, dto: UpdateStateDto, userId?: number) {
    const before = await this.findOne(id);
    const updated = await this.prisma.state.update({ where: { id }, data: dto });
    await this.audit.log(userId || null, 'State', id, AuditAction.UPDATE, before, updated);
    return updated;
  }

  async remove(id: number, userId?: number) {
    const before = await this.findOne(id);
    const deleted = await this.prisma.state.delete({ where: { id } });
    await this.audit.log(userId || null, 'State', id, AuditAction.DELETE, before, null);
    return deleted;
  }
}
