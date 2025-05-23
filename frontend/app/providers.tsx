"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "sonner";
import AuthInitializer from "@/components/auth/AuthInitializer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
      <Toaster position="top-left" />
    </Provider>
  );
}
