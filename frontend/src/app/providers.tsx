import type { PropsWithChildren } from 'react';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function Providers({ children }: PropsWithChildren) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}	
