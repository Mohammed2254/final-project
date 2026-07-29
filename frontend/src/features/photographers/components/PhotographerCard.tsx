import { Link } from 'react-router-dom';
import { Clock, Plane, Video } from 'lucide-react';

import { AddToWeddingPlanButton } from '@/components/common/AddToWeddingPlanButton';
import { Card } from '@/components/common/Card';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { ServiceImage } from '@/components/common/ServiceImage';
import { PriceText } from '@/components/common/PriceText';
import type { PhotographerItem } from '@/types/photographer';

interface PhotographerCardProps {
  photographer: PhotographerItem;
}

const CHIP = 'inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground';

export function PhotographerCard({ photographer }: PhotographerCardProps) {
  return (
    <Card className="group relative h-full overflow-hidden rounded-2xl p-0 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl">
      <div className="absolute end-3 top-3 z-10 flex items-center gap-1.5">
        <AddToWeddingPlanButton
          serviceId={photographer.id}
          price={photographer.price}
          className="size-8"
        />
        <FavoriteButton
          serviceId={photographer.id}
          className="size-8 border border-border/60 bg-background/85 shadow-sm backdrop-blur-sm"
        />
      </div>

      <Link to={`/photographers/${photographer.id}`} className="block">
        <div className="overflow-hidden">
          <ServiceImage
            imageUrl={photographer.imageUrl}
            className="h-44 w-full transition-transform duration-500 group-hover:scale-[1.06]"
            label={photographer.name}
          />
        </div>

        <div className="space-y-2 p-4">
          <p className="line-clamp-1 font-bold text-foreground transition-colors group-hover:text-gold">
            {photographer.name}
          </p>

          {photographer.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {photographer.description}
            </p>
          )}

          {/* Only render chips for capabilities this photographer actually
              has - an empty row of greyed-out icons tells the customer
              nothing useful. */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {photographer.coverageHours > 0 && (
              <span className={CHIP}>
                <Clock size={11} aria-hidden="true" />
                {photographer.coverageHours} ساعات
              </span>
            )}
            {photographer.hasVideo && (
              <span className={CHIP}>
                <Video size={11} aria-hidden="true" />
                فيديو
              </span>
            )}
            {photographer.hasDrone && (
              <span className={CHIP}>
                <Plane size={11} aria-hidden="true" />
                درون
              </span>
            )}
          </div>

          <div className="pt-1">
            <PriceText price={photographer.price} />
          </div>
        </div>
      </Link>
    </Card>
  );
}
