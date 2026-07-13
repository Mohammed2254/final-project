import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export interface HallFiltersValue {
  keyword: string;
  minPrice: string;
  maxPrice: string;
}

interface HallFiltersProps {
  value: HallFiltersValue;
  onChange: (value: HallFiltersValue) => void;
  onReset: () => void;
}

/**
 * Search goes straight to the backend's /services/search. Price range
 * has no backend support (see hall.service.ts), so it's applied
 * client-side after the fetch. There's no capacity/city/category filter
 * here because the Service API has no such fields and no
 * categories-list endpoint to build a category dropdown from.
 */
export function HallFilters({ value, onChange, onReset }: HallFiltersProps) {
  return (
    <Card className="space-y-5 p-4">
      <div>
        <Label htmlFor="hall-search">البحث</Label>
        <div className="relative mt-1.5">
          <Search
            size={16}
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="hall-search"
            type="search"
            placeholder="ابحثوا عن اسم القاعة..."
            value={value.keyword}
            onChange={(event) => onChange({ ...value, keyword: event.target.value })}
            className="pe-9"
          />
        </div>
      </div>

      <div>
        <Label>نطاق السعر (ريال)</Label>
        <div className="mt-1.5 flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="من"
            aria-label="الحد الأدنى للسعر"
            value={value.minPrice}
            onChange={(event) => onChange({ ...value, minPrice: event.target.value })}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="إلى"
            aria-label="الحد الأقصى للسعر"
            value={value.maxPrice}
            onChange={(event) => onChange({ ...value, maxPrice: event.target.value })}
          />
        </div>
      </div>

      <Button type="button" variant="outline" size="sm" className="w-full" onClick={onReset}>
        إعادة تعيين الفلاتر
      </Button>
    </Card>
  );
}
