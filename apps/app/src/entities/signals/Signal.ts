export type Signal = {
  id: string;
  symbol: string;
  type: 'price' | 'percent';
  delta: number;
  timeFrame: number;
};
