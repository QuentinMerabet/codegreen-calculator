import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/oes6kwp.css" />
        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.1.1/css/all.css"
        />
      </Head>
      <body>
        <nav className="p-5 flex items-center gap-5">
          <a href="https://codegreen.earth/">
            <h1 className="logo flex-shrink-0">Code Green</h1>
          </a>
          <div className="separator flex-none"></div>
          <span className="powered flex-col">Powered by Heal Labs</span>
        </nav>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
