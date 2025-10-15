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
import { StatesService } from './states.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('states')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatesController {
  constructor(private readonly service: StatesService) {}

  // Todos los usuarios autenticados pueden listar estados
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Obtener uno
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // Solo Admin puede crear
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateStateDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  // Solo Admin puede actualizar
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateStateDto, @Req() req) {
    return this.service.update(Number(id), dto, req.user.id);
  }

  // Solo Admin puede borrar
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.service.remove(Number(id), req.user.id);
  }
}
