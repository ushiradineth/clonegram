import Head from "next/head";
import { useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import Home from "../components/Home";
import Auth from "../components/Auth";

const Index = () => {
  const { data: session, status } = useSession();

  if (status == "loading") {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <meta name="google-site-verification" content="WqjiADJh02W0ssceX3ZwKlqRFhVgDEEPUQjG8au1k80" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{session ? <Home /> : <Auth />}</main>
    </>
  );
};

export default Index;
