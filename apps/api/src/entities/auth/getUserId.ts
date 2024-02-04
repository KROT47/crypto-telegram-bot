import { Request } from 'express';
import { getUserIdFromInitData } from '../../shared/telegramWebApp';

export function getUserId(request: Request) {
  const { token: initData } = request.headers;
  return getUserIdFromInitData(initData);
}
