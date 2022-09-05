import Navbar from "components/Header";
import DappProvider from "contexts/DappProvider";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <DappProvider>
      <Head>
        <title>Flight Surety Dapp</title>
      </Head>
      <Navbar />
      <div className="max-w-5xl m-auto px-4 pb-10">
        <Component {...pageProps} />
      </div>
    </DappProvider>
  );
}

export default MyApp;
