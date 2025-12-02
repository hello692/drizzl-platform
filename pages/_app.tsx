import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextIntlClientProvider } from 'next-intl'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  return (
    <NextIntlClientProvider
      locale={router.locale || 'en'}
      messages={pageProps.messages}
      timeZone="America/New_York"
    >
      <Component {...pageProps} />
    </NextIntlClientProvider>
  )
}

export default MyApp
