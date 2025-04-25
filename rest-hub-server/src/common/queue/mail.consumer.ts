import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Logger } from 'winston';

import { processEnv, QUEUE_JOB_NAMES, QUEUE_NAMES } from '../constants';

@Processor(QUEUE_NAMES.MAIL)
@Injectable()
export class MailConsumer extends WorkerHost {
  private readonly transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: processEnv.MAIL_PROCESSOR_USER,
        pass: processEnv.MAIL_PROCESSOR_PASSWORD,
      },
    });
  }

  async process(job: Job<{ email: string; subject: string; text: string }>): Promise<void> {
    const { name } = job;

    const jobHandlers: Record<string, () => Promise<void>> = {
      [QUEUE_JOB_NAMES.SEND_MAIL]: async () => {
        const { email, subject, text } = job.data;

        try {
          await this.transporter.sendMail({
            from: `"rest-hub Support Team" <${processEnv.MAIL_PROCESSOR_USER}>`,
            to: email,
            subject,
            text,
          });
          this.logger.info(`Email sent successfully: ${email}`);
        } catch (error) {
          this.logger.error(`Email sending failed: ${email}`, { error });
          throw error;
        }
      },
    };

    if (jobHandlers[name]) {
      await jobHandlers[name]();
    } else {
      this.logger.warn(`Unhandled job type: ${name}`);
    }
  }
}
