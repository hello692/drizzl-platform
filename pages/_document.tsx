import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </Head>
      <body style={{ margin: 0, padding: 0, background: '#ffffff' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
