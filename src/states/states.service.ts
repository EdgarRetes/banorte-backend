import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStateDto) {
    return this.prisma.state.create({ data: dto });
  }

  async findAll() {
    return this.prisma.state.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const state = await this.prisma.state.findUnique({ where: { id } });
    if (!state) throw new NotFoundException(`State ${id} not found`);
    return state;
  }

  async update(id: number, dto: UpdateStateDto) {
    await this.findOne(id);
    return this.prisma.state.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.state.delete({ where: { id } });
  }
}
