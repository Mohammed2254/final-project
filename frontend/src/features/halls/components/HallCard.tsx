import { Link } from 'react-router-dom';

import { Card } from '@/components/common/Card';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { PriceText } from '@/components/common/PriceText';
import type { ServiceItem } from '@/types/service';

interface HallCardProps {
  hall: ServiceItem;
}

export function HallCard({ hall }: HallCardProps) {
  return (
    <Link to={`/halls/${hall.id}`} className="block">
      <Card className="h-full overflow-hidden transition-colors hover:border-gold/50">
        <PlaceholderImage className="h-32 w-full" label={hall.name} />
        <div className="space-y-1 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-foreground">{hall.name}</p>
            {/* Favorites has no backend endpoint yet - decorative only. */}
            <span aria-hidden="true" className="text-muted-foreground">
              ♡
            </span>
          </div>
          {hall.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">{hall.description}</p>
          )}
          <PriceText price={hall.price} className="text-sm" />
        </div>
      </Card>
    </Link>
  );
}
