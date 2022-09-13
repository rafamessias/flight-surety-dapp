import Navbar from "components/Header";
import DappProvider from "contexts/DappProvider";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <DappProvider>
      <Head>
        <title>Flight Surety Dapp</title>
      </Head>
      <Navbar />
      <div className="max-w-5xl m-auto px-4 pb-10">
        <Component {...pageProps} />
        <ToastContainer />
      </div>
    </DappProvider>
  );
}

export default MyApp;
