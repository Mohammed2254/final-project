import { Label } from '@/components/ui/label';
import { SORT_OPTIONS, type SortOption } from '@/utils/filterAndSortServices';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div>
      <Label htmlFor="sort-by">الترتيب حسب</Label>
      <select
        id="sort-by"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="flex h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
