import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { QUEUE_JOB_NAMES, QUEUE_NAMES } from '../constants';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL) private mailQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async addMailQueue(email: string, subject: string, text: string): Promise<string> {
    try {
      const { id } = await this.mailQueue.add(
        QUEUE_JOB_NAMES.SEND_MAIL,
        { email, subject, text },
        { attempts: 3, removeOnComplete: true },
      );

      if (!id) {
        throw new InternalServerErrorException('Failed to add job to mail queue');
      }

      return id;
    } catch (error) {
      this.logger.error(`addMailQueue`, error);
      throw new InternalServerErrorException(`Failed to queue email job: ${error}`);
    }
  }
}
