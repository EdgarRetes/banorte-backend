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

@Controller('file-store')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Admin y User pueden consultar archivos
  @Get()
  getFiles() {
    return this.filesService.getFiles();
  }

  // Admin y User pueden subir archivos
  @Post('upload')
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

  @Delete(':id')
  removeFile(@Param('id') id: string) {
    this.filesService.removeFile(id);
    return { success: true, removedId: id };
  }
}
