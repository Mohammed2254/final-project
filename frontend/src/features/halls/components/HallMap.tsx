import { MapPin } from 'lucide-react';

interface HallMapProps {
  latitude: string;
  longitude: string;
  hallName: string;
}

/** OpenStreetMap, not Google Maps: the embed is a plain URL with no API key. */
export function HallMap({ latitude, longitude, hallName }: HallMapProps) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  // A malformed coordinate would render the middle of the ocean - worse than no map.
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  // OSM embeds have no zoom parameter; the box size is what sets how close it sits.
  const span = 0.005;
  const bbox = [lon - span, lat - span, lon + span, lat + span].join(',');
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;

  return (
    <div className="mt-5 space-y-2">
      <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
        <MapPin size={15} aria-hidden="true" />
        الموقع على الخريطة
      </p>

      <iframe
        title={`موقع ${hallName} على الخريطة`}
        src={embedUrl}
        loading="lazy"
        className="h-64 w-full rounded-lg border border-border"
      />

      <a
        href={fullMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs text-gold underline-offset-2 hover:underline"
      >
        فتح الخريطة كاملة
      </a>
    </div>
  );
}
