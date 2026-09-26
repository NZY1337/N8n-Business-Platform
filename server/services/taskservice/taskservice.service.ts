import { Injectable, Logger, } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { DataSource } from 'typeorm';

// https://docs.nestjs.com/techniques/task-scheduling
// Generic scheduled-task scaffold. The previous fitness reminder-email logic
// (querying nutrition_logs) was removed as part of the backend reset —
// wire up new scheduled jobs (e.g. automation-run reminders, usage digests) here.

@Injectable()
export class TaskService {
    constructor(
        private readonly nodemailer: NodemailerService,
        private readonly dataSource: DataSource
    ) { }
    private readonly logger = new Logger(TaskService.name);

    @Cron(CronExpression.EVERY_DAY_AT_9AM, {
        name: 'daily-tasks',
        timeZone: 'Europe/Bucharest',
    })
    async handleCron() {
        // TODO: implement scheduled logic for the automation business
        // (e.g. usage summaries, billing reminders, client digests).
        this.logger.debug('Daily scheduled task tick — nothing wired up yet.');
    }
}
