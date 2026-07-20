import { Link } from 'react-router-dom';

import { Card } from '@/components/common/Card';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { PriceText } from '@/components/common/PriceText';
import type { ServiceItem } from '@/types/service';

interface HallCardProps {
  hall: ServiceItem;
}

export function HallCard({ hall }: HallCardProps) {
  return (
    <Card className="relative h-full overflow-hidden transition-colors hover:border-gold/50">
      {/* Sibling of the Link below, not nested inside it - keeps the heart
          independently clickable without triggering card navigation. */}
      <FavoriteButton
        serviceId={hall.id}
        className="absolute end-3 top-3 z-10 size-8 bg-background/80 backdrop-blur-sm"
      />
      <Link to={`/halls/${hall.id}`} className="block">
        <PlaceholderImage className="h-32 w-full" label={hall.name} />
        <div className="space-y-1 p-3.5">
          <p className="text-sm font-bold text-foreground">{hall.name}</p>
          {hall.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">{hall.description}</p>
          )}
          <PriceText price={hall.price} className="text-sm" />
        </div>
      </Link>
    </Card>
  );
}
