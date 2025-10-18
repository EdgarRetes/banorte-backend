import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // Todos los usuarios autenticados pueden ver empresas
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  // Solo Admin puede crear
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateCompanyDto, @Req() req: any) {
    return this.companiesService.create(dto, req.user?.id);
  }

  // Solo Admin puede actualizar
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto, @Req() req: any) {
    return this.companiesService.update(+id, dto, req.user?.id);
  }

  // Solo Admin puede borrar
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.companiesService.remove(+id, req.user?.id);
  }
}
