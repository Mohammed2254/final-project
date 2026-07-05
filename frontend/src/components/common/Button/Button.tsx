import * as React from 'react';

import { Button as ButtonPrimitive } from '@/components/ui/button';
import { Spinner } from '@/components/common/Loading';

type ButtonPrimitiveProps = React.ComponentProps<typeof ButtonPrimitive>;

interface ButtonProps extends ButtonPrimitiveProps {
  /** Shows a spinner and disables the button - use for form submits & API calls. */
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Every submit button in the app should go through this wrapper so loading
 * state (and therefore "disable multiple submits") is handled once, not
 * re-implemented per form.
 */
export function Button({
  isLoading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
      {isLoading ? (
        <>
          <Spinner />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}
