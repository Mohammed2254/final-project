import { Link } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, MailCheck, Search, Sparkles } from 'lucide-react';

import heroImage from '@/assets/hero-home.webp';
import logo from '@/assets/logo-farah.webp';
import { LandingFeatures } from '@/features/landing/components/LandingFeatures';
import { LandingHeader } from '@/features/landing/components/LandingHeader';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const STEPS = [
  { icon: MailCheck, title: 'أنشئوا خطتكم', body: 'خطة واحدة تجمع تاريخ المناسبة والميزانية.' },
  { icon: HeartHandshake, title: 'ادعوا شريككم', body: 'رمز دعوة واحد ينضم به الطرف الآخر للخطة.' },
  { icon: Search, title: 'اختاروا الخدمات', body: 'تصفّحوا القاعات والمصوّرين وأضيفوا ما يناسبكم.' },
  { icon: Sparkles, title: 'وافقوا معاً', body: 'كل اختيار ينتظر موافقة الطرفين قبل اعتماده.' },
] as const;

const STATS = [
  { value: '63', label: 'نقطة API' },
  { value: '14', label: 'جدول بقاعدة البيانات' },
  { value: '58', label: 'اختبار آلي ناجح' },
  { value: '3', label: 'أعضاء فريق' },
] as const;

const REPO_URL = 'https://github.com/Mohammed2254/final-project';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_50%,var(--gold)_0%,transparent_70%)] opacity-[0.12]"
        />

        <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-bold text-gold">
              <Sparkles size={13} aria-hidden="true" />
              مشروع تخرّج · Holberton School
            </span>

            <h1 className="mt-6 text-3xl font-extrabold leading-[1.3] text-foreground lg:text-5xl lg:leading-[1.25]">
              خطّطوا زفافكم <span className="text-gold">معًا</span>،
              <br />
              لا كلٌّ على حدة.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-loose text-muted-foreground lg:text-lg">
              منصة سعودية تجمع قاعات الأفراح والمصوّرين في مكان واحد، وتتيح للعروسين
              خطة مشتركة لا تُعتمد فيها أي خدمة إلا بموافقة الطرفين.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to={ROUTES.HOME}
                className={cn(buttonVariants({ variant: 'gold', size: 'lg' }), 'rounded-full px-7')}
              >
                ابدأوا التخطيط
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full px-7')}
              >
                الكود على GitHub
              </a>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-gold/20 via-transparent to-gold/10 blur-3xl"
            />
            <img
              src={heroImage}
              alt="خاتما زفاف ذهبيان بجانب باقة ورد أبيض"
              width={850}
              height={567}
              fetchPriority="high"
              className="relative w-full rounded-3xl border border-border object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <LandingFeatures />

      {/* ---------- How it works ---------- */}
      <section id="how" className="scroll-mt-28 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-gold">كيف تعمل</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-snug text-foreground lg:text-4xl">
              أربع خطوات من الفكرة إلى الحجز
            </h2>
          </div>

          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, body }, index) => (
              <li
                key={title}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg"
              >
                <span className="absolute end-5 top-5 text-3xl font-extrabold text-muted-foreground/15 transition-colors group-hover:text-gold/25">
                  {index + 1}
                </span>
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="border-y border-border bg-muted/30 py-14">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 lg:grid-cols-4 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-gold lg:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-xs text-muted-foreground lg:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Story ---------- */}
      <section id="about" className="scroll-mt-28 py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-sm font-bold text-gold">القصة</p>
          <h2 className="mt-3 text-2xl font-extrabold leading-snug text-foreground lg:text-4xl">
            لماذا بنينا «فرح»
          </h2>

          <div className="mt-8 space-y-5 leading-loose text-muted-foreground">
            <p>
              تخطيط زفاف واحد في السعودية يعني عادةً الاتصال بأكثر من عشرة مزوّدين،
              ومقارنة الأسعار يدويًا، وتشتيت القرارات بين محادثات متفرقة. عملية
              مرهقة وبطيئة ومبعثرة.
            </p>
            <p>
              لكن ما لفت انتباهنا لم يكن التشتّت وحده، بل شيء أدق:{' '}
              <strong className="font-bold text-foreground">
                العروسان غالبًا ليسا في المكان نفسه وقت اتخاذ القرار
              </strong>
              . ومع ذلك، كل المنصات الموجودة مبنية على أساس مستخدم واحد يقرّر.
            </p>
            <p>
              من هنا وُلد السؤال الذي حدّد المشروع كله: كيف يمكن أن نجعل الزوجين
              يقرّران معًا حتى وهما متباعدان؟ فبنينا الخطة المشتركة، وهي الميزة
              التي جعلتنا نختار هذه الفكرة من بين خمس عشرة فكرة درسناها.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-4 pb-20 lg:px-8 lg:pb-28">
        <div className="container mx-auto overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-card to-card p-10 text-center lg:p-16">
          <h2 className="text-2xl font-extrabold text-foreground lg:text-3xl">جرّبوها بأنفسكم</h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-muted-foreground">
            أنشئوا حسابًا، تصفّحوا الخدمات، وابدأوا خطة زفاف مشتركة مع شريككم.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={ROUTES.REGISTER}
              className={cn(buttonVariants({ variant: 'gold', size: 'lg' }), 'rounded-full px-7')}
            >
              إنشاء حساب
            </Link>
            <Link
              to={ROUTES.HOME}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full px-7')}
            >
              تصفّح بدون حساب
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto flex flex-col items-center gap-5 px-4 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-start">
          <img src={logo} alt="فرح" className="h-7 w-auto" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} فرح · مشروع تخرّج في Holberton School
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            مستودع GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
