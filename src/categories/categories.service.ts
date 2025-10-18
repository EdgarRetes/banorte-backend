import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit_logs/audit.service';
import { AuditAction } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit_logs/audit.module';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateCategoryDto, userId?: number) {
    const category = await this.prisma.category.create({ data: dto });
    await this.audit.log(userId || null, 'Category', category.id, AuditAction.CREATE, null, category);
    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto, userId?: number) {
    const before = await this.findOne(id);
    const updated = await this.prisma.category.update({ where: { id }, data: dto });
    await this.audit.log(userId || null, 'Category', id, AuditAction.UPDATE, before, updated);
    return updated;
  }

  async remove(id: number, userId?: number) {
    const before = await this.findOne(id);
    const deleted = await this.prisma.category.delete({ where: { id } });
    await this.audit.log(userId || null, 'Category', id, AuditAction.DELETE, before, null);
    return deleted;
  }
}
