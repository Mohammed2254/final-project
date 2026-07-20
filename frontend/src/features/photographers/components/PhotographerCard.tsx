import { Link } from 'react-router-dom';

import { Card } from '@/components/common/Card';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { PriceText } from '@/components/common/PriceText';
import type { PhotographerItem } from '@/types/photographer';

interface PhotographerCardProps {
  photographer: PhotographerItem;
}

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  return (
    <Card className="relative h-full overflow-hidden transition-colors hover:border-gold/50">
      <FavoriteButton
        serviceId={photographer.id}
        className="absolute end-3 top-3 z-10 size-8 bg-background/80 backdrop-blur-sm"
      />
      <Link to={`/photographers/${photographer.id}`} className="block">
        <PlaceholderImage className="h-32 w-full" label={photographer.name} />
        <div className="space-y-1 p-3.5">
          <p className="text-sm font-bold text-foreground">{photographer.name}</p>
          {photographer.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {photographer.description}
            </p>
          )}
          <PriceText price={photographer.price} className="text-sm" />
        </div>
      </Link>
    </Card>
  );
}
