"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
