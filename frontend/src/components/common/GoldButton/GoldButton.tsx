import * as React from 'react';

import { Button } from '@/components/common/Button';

type GoldButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant'>;

export function GoldButton(props: GoldButtonProps) {
  return <Button variant="gold" {...props} />;
}