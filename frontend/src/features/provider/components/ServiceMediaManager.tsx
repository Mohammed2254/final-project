import { useState } from 'react';
import { ImageOff, Star, Trash2 } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { GoldBadge } from '@/components/common/GoldBadge';
import { Spinner } from '@/components/common/Loading';
import { useServiceMedia } from '@/features/provider/hooks/useServiceMedia';
import { cn } from '@/lib/utils';

interface ServiceMediaManagerProps {
  serviceId: number;
}

interface MediaThumbnailProps {
  url: string;
}

function MediaThumbnail({ url }: MediaThumbnailProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-20 w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground">
        <ImageOff size={18} aria-hidden="true" />
        <span className="text-[0.65rem]">تعذر تحميل الصورة</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className={cn('h-20 w-full object-cover')}
      onError={() => setFailed(true)}
    />
  );
}

/**
 * URL-based image gallery manager for a single service - no file-upload
 * backend exists in this project (only service_media.media_url), so images
 * are added by pasting a hosted URL, matching every other media field in
 * the app (halls/photographers/ServiceCard all render from a URL already).
 */
export function ServiceMediaManager({ serviceId }: ServiceMediaManagerProps) {
  const { media, isLoading, error, addMedia, setMain, removeMedia } = useServiceMedia(serviceId);
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) return;
    setIsAdding(true);
    const ok = await addMedia(url.trim());
    setIsAdding(false);
    if (ok) setUrl('');
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      ) : (
        <>
          {media.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا توجد صور لهذه الخدمة بعد.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {media.map((item) => (
                <div
                  key={item.media_id}
                  className="group relative overflow-hidden rounded-md border border-border"
                >
                  <MediaThumbnail url={item.media_url} />

                  {item.is_main && (
                    <GoldBadge className="absolute start-1.5 top-1.5">رئيسية</GoldBadge>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-background/80 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    {!item.is_main && (
                      <button
                        type="button"
                        title="تعيين كصورة رئيسية"
                        onClick={() => setMain(item.media_id)}
                        className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-gold"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      title="حذف الصورة"
                      onClick={() => removeMedia(item.media_id)}
                      className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
            />
            <Button
              type="button"
              size="sm"
              isLoading={isAdding}
              disabled={!url.trim()}
              onClick={handleAdd}
            >
              إضافة صورة
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
