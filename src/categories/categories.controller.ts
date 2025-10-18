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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // Todos los usuarios autenticados pueden ver categorías
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Obtener una categoría específica
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // Solo Admin puede crear
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateCategoryDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  // Solo Admin puede actualizar
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Req() req) {
    return this.service.update(Number(id), dto, req.user.id);
  }

  // Solo Admin puede borrar
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.service.remove(Number(id), req.user.id);
  }
}
