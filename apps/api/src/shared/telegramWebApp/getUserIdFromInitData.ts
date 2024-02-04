import { parseInitData } from '@tma.js/sdk';

export function getUserIdFromInitData(initData: unknown): number | undefined {
  try {
    const data = parseInitData(initData);
    return data.user?.id;
  } catch (e) {
    return undefined;
  }
}
