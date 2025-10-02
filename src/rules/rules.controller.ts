import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller('business-rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  create(@Body() dto: CreateRuleDto) {
    console.log(dto);
    return this.rulesService.create(dto);
  }

  @Get()
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.rulesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rulesService.remove(+id);
  }
}
