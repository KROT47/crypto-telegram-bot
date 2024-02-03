export function getPriceFormatter(
  options?: Partial<Intl.NumberFormatOptions>,
  locale = 'en-US'
) {
  const priceIntl = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    ...options,
  });

  return (amount: number) => priceIntl.format(amount);
}
