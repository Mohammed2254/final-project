import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/format';

interface PriceTextProps {
  price: number;
  className?: string;
}

/** Renders a price via the shared formatPrice() util in bold brand-gold. */
export function PriceText({ price, className }: PriceTextProps) {
  return <span className={cn('font-bold text-gold', className)}>{formatPrice(price)}</span>;
}