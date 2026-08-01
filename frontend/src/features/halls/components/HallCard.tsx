import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

import { AddToWeddingPlanButton } from '@/components/common/AddToWeddingPlanButton';
import { Card } from '@/components/common/Card';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { ServiceImage } from '@/components/common/ServiceImage';
import { PriceText } from '@/components/common/PriceText';
import type { HallItem } from '@/types/hall';

interface HallCardProps {
  hall: HallItem;
}

export function HallCard({ hall }: HallCardProps) {
  const capacity =
    hall.minCapacity && hall.maxCapacity
      ? `${hall.minCapacity} - ${hall.maxCapacity} ضيف`
      : null;

  return (
    <Card className="group relative h-full overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl">
      {/* Siblings of the Link below, not nested inside it - keeps these
          buttons independently clickable without triggering navigation. */}
      <div className="absolute end-3 top-3 z-10 flex items-center gap-1.5">
        <AddToWeddingPlanButton serviceId={hall.id} price={hall.price} className="size-8" />
        <FavoriteButton
          serviceId={hall.id}
          className="size-8 border border-border/60 bg-background/85 shadow-sm backdrop-blur-sm"
        />
      </div>

      <Link to={`/halls/${hall.id}`} className="block">
        <div className="relative overflow-hidden">
          <ServiceImage
            imageUrl={hall.imageUrl}
            className="h-44 w-full transition-transform duration-500 group-hover:scale-[1.06]"
            label={hall.name}
          />
          {/* Gradient scrim so the city chip stays readable on any photo. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent"
          />
          {hall.city && (
            <span className="absolute bottom-3 start-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold text-foreground backdrop-blur-sm">
              {hall.city}
            </span>
          )}
        </div>

        <div className="space-y-2 p-4">
          <p className="line-clamp-1 font-bold text-foreground transition-colors group-hover:text-gold">
            {hall.name}
          </p>

          {hall.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {hall.description}
            </p>
          )}

          <div className="flex items-end justify-between gap-2 pt-1">
            <PriceText price={hall.price} />
            {capacity && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users size={12} aria-hidden="true" />
                {capacity}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
