const formatter = new Intl.NumberFormat('ar-SA', {
  style: 'currency',
  currency: 'SAR',
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return formatter.format(price);
}