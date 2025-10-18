import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit_logs/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [StatesController],
  providers: [StatesService],
})
export class StatesModule {}
