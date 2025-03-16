import { ProcessEnv } from './interfaces/common.interface';

export const processEnv: ProcessEnv = process.env as ProcessEnv;

export const QUEUE_NAMES = {
  MAIL: 'mailQueue',
} as const;

export const QUEUE_JOB_NAMES = {
  SEND_MAIL: 'sendMail',
} as const;

export const ERROR_CODE = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID__PASSWORD: 'INVALID__PASSWORD',
} as const;
