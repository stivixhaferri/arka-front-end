// middleware.ts or app/[locale]/middleware.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const SUPPORTED_LOCALES = ['en', 'it', 'sq'];

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('locale')?.value;


  const locale = SUPPORTED_LOCALES.includes(cookieLocale) ? cookieLocale : 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
