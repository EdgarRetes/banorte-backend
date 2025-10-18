import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('file-store')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Admin y User pueden consultar archivos
  @Get()
  @Roles('Admin', 'User')
  getFiles() {
    return this.filesService.getFiles();
  }

  // Admin y User pueden subir archivos
  @Post('upload')
  @Roles('Admin', 'User')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('execution') executionJson?: string,
  ) {
    let execution = undefined;
    if (executionJson) {
      try {
        execution = JSON.parse(executionJson);
      } catch {
        console.error('Error parsing execution JSON');
      }
    }

    this.filesService.addFile(file, execution);
    return { success: true, file: file.originalname };
  }

  // Solo Admin puede borrar archivos
  @Delete(':id')
  @Roles('Admin')
  removeFile(@Param('id') id: string) {
    this.filesService.removeFile(id);
    return { success: true, removedId: id };
  }
}
