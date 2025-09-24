import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { RulesModule } from './rules/rules.module';
import { RuleExecutionsModule } from './rule_executions/rule_execution.module';
import { NativeFilesModule } from './native_files/native_files.module';
import { LayoutFieldsModule } from './layout_fields/rules.module';
import { LayoutValuesController } from './layout_values/layout_values.controller';
import { LayoutValuesModule } from './layout_values/layout_values.module';
import { FileParsersModule } from './file_parsers/file_parsers.module';
import { CategoriesModule } from './categories/categories.module';
import { StatesModule } from './states/states.module';


@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CompaniesModule,
    RulesModule,
    RuleExecutionsModule,
    NativeFilesModule,
    LayoutFieldsModule,
    LayoutValuesModule,
    FileParsersModule,
    AuthModule,
    CategoriesModule,
    StatesModule,
  ],
})
export class AppModule { }
