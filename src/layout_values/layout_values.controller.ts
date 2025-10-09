import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LayoutValuesService } from './layout_values.service';
import { CreateLayoutValueDto } from './dto/create-layout_value.dto';
import { UpdateLayoutValueDto } from './dto/update-layout_value.dto';

@Controller('layout-values')
export class LayoutValuesController {
  constructor(private readonly layoutValuesService: LayoutValuesService) { }

  @Post()
  create(@Body() dto: CreateLayoutValueDto) {
    return this.layoutValuesService.create(dto);
  }

  @Get('file/:fileId')
  findByFileId(@Param('fileId') fileId: string) {
    return this.layoutValuesService.findByFileId(+fileId);
  }


  @Patch('bulk')
  async updateBulk(@Body() values: UpdateLayoutValueDto[]) {
    return this.layoutValuesService.updateBulk(values);
  }

  @Patch('validate/:fileId')
  async validateFile(@Param('fileId') fileId: string) {
    const status = await this.layoutValuesService.validateFileLayout(+fileId);
    return { fileId: +fileId, status };
  }
  // @Get()
  // findAll() {
  //   return this.layoutValuesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.layoutValuesService.findOne(+id);
  // }


  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.layoutValuesService.remove(+id);
  // }
}
