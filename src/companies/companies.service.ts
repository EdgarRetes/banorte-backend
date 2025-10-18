import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit_logs/audit.service';
import { AuditAction } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuditModule } from '../audit_logs/audit.module';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(dto: CreateCompanyDto, userId?: number) {
    const company = await this.prisma.company.create({ data: dto });
    await this.audit.log(userId || null, 'Company', company.id, AuditAction.CREATE, null, company);
    return company;
  }

  async findAll() {
    return this.prisma.company.findMany();
  }

  async findOne(id: number) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateCompanyDto, userId?: number) {
    const before = await this.prisma.company.findUnique({ where: { id } });
    const updated = await this.prisma.company.update({
      where: { id },
      data: dto,
    });
    await this.audit.log(userId || null, 'Company', id, AuditAction.UPDATE, before, updated);
    return updated;
  }

  async remove(id: number, userId?: number) {
    const before = await this.prisma.company.findUnique({ where: { id } });
    const deleted = await this.prisma.company.delete({ where: { id } });
    await this.audit.log(userId || null, 'Company', id, AuditAction.DELETE, before, null);
    return deleted;
  }

  async countCompanies(): Promise<number> {
    return this.prisma.company.count();
  }
}
