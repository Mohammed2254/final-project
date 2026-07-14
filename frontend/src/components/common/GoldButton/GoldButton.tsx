import * as React from 'react';

import { Button } from '@/components/common/Button';

type GoldButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant'>;

/**
 * Preset wrapper over the shared Button for primary, brand-gold CTAs -
 * equivalent to <Button variant="gold" />. Other Button usages/variants are untouched.
 */
export function GoldButton(props: GoldButtonProps) {
  return <Button variant="gold" {...props} />;
}