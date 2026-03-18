import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Pleep" width={22} height={22} />
          <span className="text-[15px] font-semibold tracking-tight">Pleep</span>
        </div>
      ),
    },
    i18n: true,
    links: [
      {
        text: 'pleep.app',
        url: 'https://pleep.app',
      },
    ],
  };
}
