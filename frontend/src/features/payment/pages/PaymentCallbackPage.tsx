import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

import { Card, CardBody } from '@/components/common/Card';
import { Spinner } from '@/components/common/Loading';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { usePaymentCallback } from '@/features/payment/hooks/usePaymentCallback';
import { ROUTES } from '@/constants/routes';

export default function PaymentCallbackPage() {
  const { status, error } = usePaymentCallback();

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4 py-8">
      <Card className="w-full">
        <CardBody className="flex flex-col items-center gap-4 p-8 text-center">
          {status === 'confirming' && (
            <>
              <Spinner size={28} />
              <p className="text-sm text-muted-foreground">جارٍ تأكيد عملية الدفع...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 size={40} className="text-success" aria-hidden="true" />
              <h2 className="text-lg font-bold text-foreground">تم الدفع بنجاح</h2>
              <p className="text-sm text-muted-foreground">
                شكرًا لكم، تم تأكيد دفعتكم وتحديث حالة الحجز.
              </p>
              <Link
                to={ROUTES.MY_BOOKINGS}
                className={cn(buttonVariants({ variant: 'gold' }), 'w-full')}
              >
                عرض حجوزاتي
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={40} className="text-destructive" aria-hidden="true" />
              <h2 className="text-lg font-bold text-foreground">تعذّر تأكيد الدفع</h2>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Link
                to={ROUTES.MY_BOOKINGS}
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                العودة لحجوزاتي
              </Link>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
