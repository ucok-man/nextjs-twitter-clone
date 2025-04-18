"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const queryclient = new QueryClient();

export const refetchNow = (querykey: string[]) => {
  querykey.forEach((key) => {
    queryclient.invalidateQueries({
      queryKey: [key],
    });
    queryclient.refetchQueries({
      queryKey: [key],
    });
  });
};

export default function ContextProviders({ children }: Props) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
