import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLayoutValueDto } from './dto/create-layout_value.dto';
import { UpdateLayoutValueDto } from './dto/update-layout_value.dto';

@Injectable()
export class LayoutValuesService {
  constructor(private prisma: PrismaService) {}

  // Crear un LayoutValue
  async create(dto: CreateLayoutValueDto) {
    // Verificar que el archivo y el campo existan
    const fileExists = await this.prisma.fileBanorte.findUnique({
      where: { id: dto.fileId },
    });
    if (!fileExists) throw new NotFoundException(`File ${dto.fileId} not found`);

    const fieldExists = await this.prisma.layoutField.findUnique({
      where: { id: dto.fieldId },
    });
    if (!fieldExists) throw new NotFoundException(`Field ${dto.fieldId} not found`);

    // Intentar crear el LayoutValue
    try {
      const created = await this.prisma.layoutValue.create({
        data: {
          fileId: dto.fileId,
          fieldId: dto.fieldId,
          row: dto.row,
          value: dto.value ?? '',
        },
      });

      // Validar el archivo después de crear un valor
      const execution = await this.prisma.ruleExecution.findFirst({
        where: { fileId: dto.fileId },
      });

      if (execution && execution.status !== 'IN_PROGRESS') {
        await this.validateFileLayout(dto.fileId);
      }

      return created;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Duplicate entry for combination (fileId=${dto.fileId}, fieldId=${dto.fieldId}, row=${dto.row})`
        );
      }
      throw error;
    }
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
          fileId: value.fileId!,
          fieldId: value.fieldId!,
          row: value.row!,
        },
        data: { value: value.value ?? '' },
      }),
    );

    await Promise.all(updates);

    const execution = await this.prisma.ruleExecution.findFirst({
      where: { fileId: values[0].fileId! },
    });

    if (execution && execution.status !== 'IN_PROGRESS') {
      await this.validateFileLayout(values[0].fileId!);
    }

    return { message: 'Layout values updated successfully' };
  }

  // Validar un archivo
  async validateFileLayout(fileId: number) {
    // Contar el número de LayoutFields
    const totalFields = await this.prisma.layoutField.count();

    // Obtener todas las filas distintas del archivo
    const rows = await this.prisma.layoutValue.findMany({
      where: { fileId },
      select: { row: true },
    });
    const rowCount = new Set(rows.map(r => r.row)).size;

    // Total de valores esperados = filas * campos
    const totalValuesExpected = rowCount * totalFields;

    // Contar los valores que no están vacíos
    const valueCount = await this.prisma.layoutValue.count({
      where: {
        fileId,
        value: { not: '' },
      },
    });

    // Solo SUCCESS si todos los valores existen
    const status = valueCount === totalValuesExpected ? 'SUCCESS' : 'FAILED';

    // Actualizar el estado de las ejecuciones
    await this.prisma.ruleExecution.updateMany({
      where: { fileId },
      data: { status },
    });

    return status;
  }
}
