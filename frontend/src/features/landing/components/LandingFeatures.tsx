import { CalendarCheck, LayoutDashboard, Users } from 'lucide-react';

import browseShot from '@/assets/feature-browse.webp';
import plannerShot from '@/assets/feature-planner.webp';
import providerShot from '@/assets/feature-provider.webp';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Users,
    eyebrow: 'الميزة الجوهرية',
    title: 'خطة واحدة، قراران',
    body: 'ينشئ أحد الطرفين الخطة ويدعو شريكه برمز خاص. كل خدمة يضيفها أحدهما تبقى «بانتظار الموافقة» حتى يوافق الآخر، فلا يُحسم شيء من طرف واحد.',
    image: plannerShot,
    alt: 'خطة زفاف مشتركة تعرض خدمة بحالة بانتظار موافقة الشريك',
  },
  {
    icon: CalendarCheck,
    eyebrow: 'الاكتشاف',
    title: 'القاعات والمصوّرون في فهرس واحد',
    body: 'ابحثوا بالاسم، وفلتِروا بالسعر، وافتحوا صفحة تفاصيل تعرض السعة والموقع ومعدات التصوير، ثم احجزوا مباشرة دون مغادرة المنصة.',
    image: browseShot,
    alt: 'صفحة تصفّح قاعات الأفراح مع فلاتر البحث والسعر',
  },
  {
    icon: LayoutDashboard,
    eyebrow: 'لمزوّدي الخدمات',
    title: 'لوحة تدير أعمالك كاملة',
    body: 'سجّل نشاطك، وأضف خدماتك بأسعارها وصورها، واستقبل طلبات الحجز لتقبلها أو ترفضها، كل ذلك من مكان واحد.',
    image: providerShot,
    alt: 'لوحة تحكم مقدّم الخدمة تعرض خدماته وأسعارها ونموذج إضافة خدمة',
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-28 border-t border-border bg-muted/30 py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-gold">المميزات</p>
          <h2 className="mt-3 text-2xl font-extrabold leading-snug text-foreground lg:text-4xl">
            كل ما تحتاجونه لتخطيط زفافكم
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            من اكتشاف الخدمات إلى الاتفاق عليها كزوجين، إلى إدارتها من طرف مزوّد الخدمة.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {FEATURES.map(({ icon: Icon, eyebrow, title, body, image, alt }, index) => (
            <div
              key={title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* Alternate which side the screenshot sits on so the page
                  doesn't read as three identical rows. */}
              <div className={cn(index % 2 === 1 && 'lg:order-2')}>
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gold">{eyebrow}</p>
                <h3 className="mt-2 text-xl font-extrabold leading-snug text-foreground lg:text-2xl">
                  {title}
                </h3>
                <p className="mt-4 leading-loose text-muted-foreground">{body}</p>
              </div>

              <div className={cn('relative', index % 2 === 1 && 'lg:order-1')}>
                {/* Soft brand glow behind the frame - keeps the light
                    screenshots from floating on a plain background. */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-gold/15 via-transparent to-gold/10 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    className="w-full rounded-xl border border-border/60"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
