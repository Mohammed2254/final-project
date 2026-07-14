import { Card } from '@/components/common/Card';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { PriceText } from '@/components/common/PriceText';
import type { ServiceItem } from '@/types/service';

interface ServiceCardProps {
  service: ServiceItem;
}


export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-colors hover:border-gold/50">
      <PlaceholderImage className="h-32 w-full" label={service.name} />
      <div className="space-y-1 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-foreground">{service.name}</p>
          {/* Favorites aren't backed by any endpoint yet . */}
          <span aria-hidden="true" className="text-muted-foreground">
            ♡
          </span>
        </div>
        {service.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{service.description}</p>
        )}
        <PriceText price={service.price} className="text-sm" />
      </div>
    </Card>
  );
}