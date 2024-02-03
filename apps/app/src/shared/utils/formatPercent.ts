const percentIntl = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 3,
  signDisplay: 'never',
});

export function formatPercent(percent: number): string {
  return percentIntl.format(percent / 100);
}
