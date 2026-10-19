export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹—';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
