import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(
    //private usersService: UsersService,
    //private filesService: FileParsersService, No es fileparsers es native_files
    private statsService: StatsService,
  ) {}

  @Get()
  async getStats() {

    const stats = await this.statsService.getStats();
    return stats;
    // const users = await this.statsService.countUsers();
    // const files = await this.statsService.countFilesThisMonth();
    // const changes = await this.statsService.countChangesLastWeek();
    // const notifications = "Últimas notificaciones aquí"; // Falta implementar

    // return { users, files, changes, notifications };
  }
}