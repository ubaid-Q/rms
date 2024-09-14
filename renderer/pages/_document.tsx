import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <link rel="manifest" href="/manifest.json" />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
