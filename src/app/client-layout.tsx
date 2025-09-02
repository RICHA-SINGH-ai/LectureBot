
'use client';

import { ThemeProvider } from '@/components/theme-provider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <html lang="en" suppressHydrationWarning>
        {children}
      </html>
    </ThemeProvider>
  );
}
