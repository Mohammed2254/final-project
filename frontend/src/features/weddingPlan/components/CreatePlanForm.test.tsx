import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreatePlanForm } from '@/features/weddingPlan/components/CreatePlanForm';

function renderForm() {
  const onCreate = vi.fn().mockResolvedValue(true);
  render(<CreatePlanForm isMutating={false} onCreate={onCreate} />);
  return { onCreate, user: userEvent.setup() };
}

describe('CreatePlanForm', () => {
  it('blocks submission and explains why when the form is empty', async () => {
    const { onCreate, user } = renderForm();

    await user.click(screen.getByRole('button', { name: 'إنشاء الخطة' }));

    expect(await screen.findByText('اسم الخطة يجب ألا يقل عن حرفين')).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('rejects a budget of zero', async () => {
    const { onCreate, user } = renderForm();

    await user.type(screen.getByLabelText('اسم الخطة'), 'زفاف سارة وأحمد');
    await user.type(screen.getByLabelText('الميزانية التقديرية (ريال)'), '0');
    await user.click(screen.getByRole('button', { name: 'إنشاء الخطة' }));

    expect(await screen.findByText('الميزانية يجب أن تكون أكبر من صفر')).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('submits a fully valid plan', async () => {
    const { onCreate, user } = renderForm();

    const nextYear = new Date().getFullYear() + 1;

    await user.type(screen.getByLabelText('اسم الخطة'), 'زفاف سارة وأحمد');
    await user.type(screen.getByLabelText('الميزانية التقديرية (ريال)'), '50000');
    await user.type(screen.getByLabelText('تاريخ المناسبة'), `${nextYear}-06-15`);
    await user.click(screen.getByRole('button', { name: 'إنشاء الخطة' }));

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith('زفاف سارة وأحمد', `${nextYear}-06-15`, '50000', null);
    });
  });
});
