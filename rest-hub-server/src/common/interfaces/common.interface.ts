import { ORDER_TYPES } from '../constants';

export interface ProcessEnv {
  [key: string]: string;
}

export interface ClassConstructor {
  new (...args: any[]): object;
}

export type OrderTypes = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];
