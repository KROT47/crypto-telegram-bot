export function getPercentFormatter(
  options?: Partial<Intl.NumberFormatOptions>,
  locale = 'en-US'
) {
  const percentIntl = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 3,
    ...options,
  });

  return (percent: number) => percentIntl.format(percent / 100);
}
