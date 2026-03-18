import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '../layout.config';
import { source } from '@/lib/source';
import { i18n, localeNames } from '@/lib/i18n';
import { I18nProvider } from 'fumadocs-ui/i18n';

export function generateStaticParams() {
  return i18n.languages.map((lang: string) => ({ lang }));
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <I18nProvider
      locale={lang}
      locales={i18n.languages.map((l) => ({
        name: localeNames[l] || l,
        locale: l,
      }))}
    >
      <DocsLayout
        tree={(source.pageTree as any)[lang]}
        {...baseOptions(lang)}
      >
        {children}
      </DocsLayout>
    </I18nProvider>
  );
}
