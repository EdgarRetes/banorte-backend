import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async countChangesLastWeek(): Promise<number> {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    return this.prisma.ruleExecution.count({
      where: {
        executedAt: { gte: oneWeekAgo },
      },
    });
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async countFilesThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.fileBanorte.count({
      where: { createdAt: { gte: startOfMonth } },
    });
  }

  async countFilesAllTime(): Promise<number> {
    return this.prisma.fileBanorte.count();
  }

  async getNotifications(): Promise<string> {
    // Notificaciones
    return "Últimas notificaciones aquí";
  }

  async getRulesPerMonth(): Promise<{ month: string; count: number }[]> {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    const executions = await this.prisma.ruleExecution.findMany({
      where: {
        executedAt: { gte: sixMonthsAgo },
      },
      select: {
        executedAt: true,
      },
    });

    const countsByMonth: Record<string, number> = {};

    executions.forEach(({ executedAt }) => {
      const month = executedAt.toISOString().slice(0, 7);
      countsByMonth[month] = (countsByMonth[month] || 0) + 1;
    });

    return Object.entries(countsByMonth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getRuleStatus(): Promise<{ label: string; value: number }[]> {
    const results = await this.prisma.ruleExecution.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return results.map((r) => {
      let label: string;
      switch (r.status) {
        case 'IN_PROGRESS':
          label = 'En proceso';
          break;
        case 'FAILED':
          label = 'Fallida';
          break;
        case 'SUCCESS':
          label = 'Exitosa';
          break;
        default:
          label = r.status;
      }
      return { label, value: r._count.status };
    });
  }

  async getSuccessDay(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.ruleExecution.count({
      where: {
        status: 'SUCCESS',
        executedAt: { gte: today },
      },
    });
  }

  async getSuccessMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.ruleExecution.count({
      where: {
        status: 'SUCCESS',
        executedAt: { gte: startOfMonth },
      },
    });
  }

  async getStats() {
    const [
      users,
      files,
      filesAllTime,
      changes,
      notifications,
      rulesPerMonth,
      ruleStatus,
      successDay,
      successMonth,
    ] = await Promise.all([
      this.countUsers(),
      this.countFilesThisMonth(),
      this.countFilesAllTime(),
      this.countChangesLastWeek(),
      this.getNotifications(),
      this.getRulesPerMonth(),
      this.getRuleStatus(),
      this.getSuccessDay(),
      this.getSuccessMonth(),
    ]);

    return {
      users,
      files,
      filesAllTime,
      changes,
      notifications,
      rulesPerMonth,
      ruleStatus,
      successDay,
      successMonth,
    };
  }
}
