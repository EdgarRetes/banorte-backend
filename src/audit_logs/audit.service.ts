import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc', // 👈 ordena del más reciente al más antiguo
      },
      select: {
        id: true,
        entityName: true,
        recordId: true,
        action: true,
        before: true,
        after: true,
        userId: true,
        createdAt: true,
      },
    });
  }

  // async findOne(id: number) {
  //   return this.prisma.auditLog.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       entityName: true,
  //       recordId: true,
  //       action: true,
  //       before: true,
  //       after: true,
  //       userId: true,
  //       createdAt: true,
  //     },
  //   });
  // }
}
