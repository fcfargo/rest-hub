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

export const ORDER_TYPES = {
  DESC: 'DESC',
  ASC: 'ASC',
} as const;

export const NOTIFICATION_MESSAGES_KO = {
  FOLLOW: '회원님을 팔로우하기 시작했습니다.',
  LIKE: '회원님의 게시물을 좋아합니다.',
};
