import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';


export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2.5">
          {/* <Image src="/logo.svg" alt="Pleep" width={22} height={22} /> */}
          <span className="text-[15px] font-semibold tracking-tight">Pleep Docs</span>
        </div>
      ),
    },
    i18n: true,
    links: [
      {
        text: 'Pleep',
        url: 'https://pleep.app',
      },
      {
        text: ({ ru: 'Войти', en: 'Sign In', kk: 'Кіру' } as Record<string, string>)[locale] ?? 'Sign In',
        url: 'https://app.pleep.app/sign-in',
      },
      {
        text: ({ ru: 'Тех. поддержка', en: 'Tech Support', kk: 'Тех. қолдау' } as Record<string, string>)[locale] ?? 'Tech Support',
        url: 'https://t.me/pleep_app_bot',
      },
    ],
  };
}
