import { Request } from 'express';
import { getUserIdFromInitData } from '../../shared/telegramWebApp';
import { validate } from '@tma.js/init-data-node';

export function getUserId(request: Request, telegramBotToken: string) {
  const { token: initData } = request.headers;
  if (typeof initData !== 'string' || initData === '') return undefined;
  try {
    validate(initData, telegramBotToken);
  } catch (e) {
    console.error(e);
    return undefined;
  }
  return getUserIdFromInitData(initData);
}
