import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';


export default function HallsPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:px-8">
      <Card className="mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-border text-muted-foreground">
          <Construction size={26} aria-hidden="true" />
        </span>

        <div>
          <h1 className="text-xl font-extrabold text-foreground">قاعات الأفراح قريباً</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            نعمل حالياً على تجهيز صفحة تصفح قاعات الأفراح، لتتمكنوا من البحث والتصفية واختيار
            القاعة المناسبة لزفافكم. تابعونا، الصفحة ستكون متاحة قريباً.
          </p>
        </div>

        <Link to={ROUTES.HOME} className={cn(buttonVariants({ size: 'lg' }))}>
          العودة إلى الرئيسية
        </Link>
      </Card>
    </div>
  );
}