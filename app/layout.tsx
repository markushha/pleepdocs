import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Pleep Docs',
    default: 'Pleep Docs',
  },
  description: 'Документация платформы Pleep — AI-агент для продаж',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
