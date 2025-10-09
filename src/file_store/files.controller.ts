import { Controller, Post, Get, Delete, Param, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-store')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get()
  getFiles() {
    return this.filesService.getFiles();
  }

  // Subir un solo archivo + execution
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
      } catch (err) {
        console.error('Error parsing execution JSON', err);
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
