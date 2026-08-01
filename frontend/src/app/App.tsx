import { ToastViewport } from '@/components/common/Toast';
import { AppRouter } from '@/routes/AppRouter';

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastViewport />
    </>
  );
}