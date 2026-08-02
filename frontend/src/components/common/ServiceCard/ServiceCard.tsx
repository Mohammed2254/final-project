import { Link } from 'react-router-dom';

import { Card } from '@/components/common/Card';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { ServiceImage } from '@/components/common/ServiceImage';
import { PriceText } from '@/components/common/PriceText';
import type { ServiceItem } from '@/types/service';

interface ServiceCardProps {
  service: ServiceItem;
}

// Seeded once at boot (see _seed_service_categories in app/__init__.py) in
// this fixed order, so the id is stable: 1 = halls, 2 = photographers.
const PHOTOGRAPHER_CATEGORY_ID = 2;

export function ServiceCard({ service }: ServiceCardProps) {
  const detailsPath =
    service.categoryId === PHOTOGRAPHER_CATEGORY_ID
      ? `/photographers/${service.id}`
      : `/halls/${service.id}`;

  return (
    <Card className="group overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md">
      {/* Sibling of the Link below, not nested inside it - keeps the
          favorite button's own click from also triggering navigation. */}
      <Link to={detailsPath} className="block overflow-hidden">
        <ServiceImage
          imageUrl={service.imageUrl}
          className="h-32 w-full transition-transform duration-300 group-hover:scale-105"
          label={service.name}
        />
      </Link>
      <div className="space-y-1 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={detailsPath} className="text-sm font-bold text-foreground hover:underline">
            {service.name}
          </Link>
          <FavoriteButton serviceId={service.id} />
        </div>
        {service.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{service.description}</p>
        )}
        <PriceText price={service.price} className="text-sm" />
      </div>
    </Card>
  );
}