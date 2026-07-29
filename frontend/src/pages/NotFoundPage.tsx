import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:px-8">
      <Card className="mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground">
          <Compass size={26} aria-hidden="true" />
        </span>

        <div>
          <p className="text-4xl font-extrabold text-gold">404</p>
          <h1 className="mt-2 text-xl font-extrabold text-foreground">لم نجد هذه الصفحة</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            الرابط الذي فتحتموه غير موجود أو تم تغييره. جرّبوا العودة للرئيسية أو
            تصفّح الخدمات المتاحة.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to={ROUTES.HOME} className={cn(buttonVariants({ variant: 'gold' }))}>
            العودة للرئيسية
          </Link>
          <Link to={ROUTES.HALLS} className={cn(buttonVariants({ variant: 'outline' }))}>
            تصفّح القاعات
          </Link>
        </div>
      </Card>
    </div>
  );
}
