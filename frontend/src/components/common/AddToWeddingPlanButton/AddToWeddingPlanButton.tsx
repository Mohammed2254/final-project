import { useState } from 'react';
import { Check, ListPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { weddingPlanService } from '@/features/weddingPlan/services/weddingPlan.service';
import { ROUTES } from '@/constants/routes';

interface AddToWeddingPlanButtonProps {
  serviceId: number;
  price: number;
  className?: string;
}

/**
 * One-shot "add to my wedding plan" action. Unlike FavoriteButton this does
 * not reflect live membership (would require loading the full selections
 * list on every card) - it just adds the service to the customer's plan and
 * shows a brief success mark, or routes to /planner when there is no plan yet.
 */
export function AddToWeddingPlanButton({ serviceId, price, className }: AddToWeddingPlanButtonProps) {
  const { isAuthenticated, account } = useAuth();
  const navigate = useNavigate();
  const canUsePlanner = isAuthenticated && account?.role === 'Customer';

  const [status, setStatus] = useState<'idle' | 'loading' | 'added' | 'error'>('idle');

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canUsePlanner) {
      navigate(ROUTES.LOGIN);
      return;
    }

    setStatus('loading');
    try {
      const plan = await weddingPlanService.getMine();

      if (!plan) {
        navigate(ROUTES.WEDDING_PLANNER);
        return;
      }

      await weddingPlanService.addService(plan.plan_id, serviceId, String(price));
      setStatus('added');
    } catch {
      setStatus('error');
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => void handleClick(event)}
      disabled={status === 'loading'}
      aria-label="إضافة إلى خطة الزفاف"
      title="إضافة إلى خطة الزفاف"
      className={cn(
        'flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-gold disabled:opacity-50',
        status === 'added' && 'text-gold',
        className,
      )}
    >
      {status === 'added' ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <ListPlus size={16} aria-hidden="true" />
      )}
    </button>
  );
}
