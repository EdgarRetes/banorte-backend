import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from '../audit_logs/audit.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/guards/roles.decorator';

@Controller('audit')
// @UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  findAll() {
    return this.audit.findAll();
  }
}
