import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLayoutValueDto } from './dto/create-layout_value.dto';
import { UpdateLayoutValueDto } from './dto/update-layout_value.dto';

@Injectable()
export class LayoutValuesService {
  constructor(private prisma: PrismaService) { }

  // Crear un LayoutValue
  async create(dto: CreateLayoutValueDto) {
    const created = await this.prisma.layoutValue.create({ data: dto });

    // Validar el archivo después de crear un valor
    const execution = await this.prisma.ruleExecution.findFirst({
      where: { fileId: dto.fileId },
    });

    // Solo validar si no está IN_PROGRESS
    if (execution && execution.status !== 'IN_PROGRESS') {
      await this.validateFileLayout(dto.fileId);
    }

    return created;
  }

  // Obtener todos los valores de un archivo
  findByFileId(fileId: number) {
    return this.prisma.layoutValue.findMany({ where: { fileId } });
  }

  // Actualizar varios LayoutValues
  async updateBulk(values: UpdateLayoutValueDto[]) {
    if (!values || values.length === 0) {
      return { message: 'No values provided' };
    }

    const updates = values.map((value) =>
      this.prisma.layoutValue.updateMany({
        where: {
          fileId: value.fileId,
          fieldId: value.fieldId,
        },
        data: { value: value.value },
      }),
    );

    await Promise.all(updates);

    const execution = await this.prisma.ruleExecution.findFirst({
      where: { fileId: values[0].fileId },
    });

    if (execution && execution.status !== 'IN_PROGRESS') {
      await this.validateFileLayout(values[0].fileId!);
    }

    return { message: 'Layout values updated successfully' };
  }

  // === Servicio reutilizable para validar un archivo ===
  async validateFileLayout(fileId: number) {
    const totalFields = await this.prisma.layoutField.count();
    const valueCount = await this.prisma.layoutValue.count({
      where: {
        fileId,
        AND: [
          { value: { not: "" } }, // no vacío
          { value: { not: undefined } }, // no nulo
        ],
      },
    });

    const status = valueCount === totalFields ? 'SUCCESS' : 'FAILED';

    await this.prisma.ruleExecution.updateMany({
      where: { fileId },
      data: { status },
    });

    return status;
  }
}
