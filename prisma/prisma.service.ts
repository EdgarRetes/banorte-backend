import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('🔌 Conectando a la base de datos...');
    await this.$connect();
    this.logger.log('✅ Conexión a BD establecida');
    this.logger.log('✅ Triggers de auditoría activos en: User, BusinessRule, Role, RolePrivilege');
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Desconectando de la base de datos...');
    await this.$disconnect();
    this.logger.log('✅ Desconexión completada');
  }

  /**
   * Ejecuta una transacción con el contexto de usuario para auditoría
   * @param userId - ID del usuario que realiza la operación
   * @param callback - Función que contiene las operaciones de Prisma
   */
  async withAuditContext<T>(userId: number | null, callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(async (tx) => {
      // Establecer el user_id en el contexto de la sesión de PostgreSQL
      if (userId !== null) {
        await tx.$executeRawUnsafe(`SET LOCAL app.current_user_id = '${userId}'`);
      }
      
      return callback(tx as PrismaClient);
    });
  }
}