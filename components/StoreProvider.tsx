// components/StoreProvider.tsx
'use client';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Use state with a lazy initializer function.
  // This function only runs ONCE during the initial mount.
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}