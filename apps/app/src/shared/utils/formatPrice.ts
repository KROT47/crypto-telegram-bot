const priceIntl = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'narrowSymbol',
});

export function formatPrice(amount: number): string {
  return priceIntl.format(amount);
}
