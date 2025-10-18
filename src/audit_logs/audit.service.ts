import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(
    userId: number | null,
    entityName: string,
    recordId: number,
    action: AuditAction,
    before?: any,
    after?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        entityName,
        recordId,
        action,
        before,
        after,
      },
    });
  }

  async findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc',
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
}
