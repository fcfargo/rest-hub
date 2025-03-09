import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueService } from './queue.service';
import { QUEUE_NAMES } from '../constants';
import { MailConsumer } from './mail.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.MAIL })],
  providers: [QueueService, MailConsumer],
  exports: [QueueService],
})
export class QueueModule {}
