import { Link } from 'react-router-dom';

import { AddToWeddingPlanButton } from '@/components/common/AddToWeddingPlanButton';
import { Card } from '@/components/common/Card';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { ServiceImage } from '@/components/common/ServiceImage';
import { PriceText } from '@/components/common/PriceText';
import type { ServiceItem } from '@/types/service';

interface HallCardProps {
  hall: ServiceItem;
}

export function HallCard({ hall }: HallCardProps) {
  return (
    <Card className="relative h-full overflow-hidden transition-colors hover:border-gold/50">
      {/* Sibling of the Link below, not nested inside it - keeps these
          buttons independently clickable without triggering card navigation. */}
      <div className="absolute end-3 top-3 z-10 flex items-center gap-1 rounded-full bg-background/80 p-1 backdrop-blur-sm">
        <AddToWeddingPlanButton serviceId={hall.id} price={hall.price} className="size-6" />
        <FavoriteButton serviceId={hall.id} className="size-6" />
      </div>
      <Link to={`/halls/${hall.id}`} className="block">
        <ServiceImage imageUrl={hall.imageUrl} className="h-32 w-full" label={hall.name} />
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
