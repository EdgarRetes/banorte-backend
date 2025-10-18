import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCompanyDto) {
    return this.prisma.company.create({ data: dto });
  }

  findAll() {
    return this.prisma.company.findMany();
  }

  findOne(id: number) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.company.delete({ where: { id } });
  }

  async countCompanies(): Promise<number> {
    return this.prisma.company.count();
  }
}
