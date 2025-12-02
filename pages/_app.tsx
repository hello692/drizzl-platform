import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
