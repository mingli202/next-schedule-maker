"use client";

import { ClerkProvider } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined");
}

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export function ClerkClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>
  );
}
