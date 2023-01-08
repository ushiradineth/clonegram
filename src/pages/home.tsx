import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { DataContext } from "../pages/_app";
import { useContext } from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const data = useContext(DataContext);

  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Home • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"select-none " + (data?.viewport == "Web" && " ml-72 ") + (data?.viewport == "Tab" && " ml-16 ")}>
        <div id="Background" className={"flex min-h-screen flex-col items-center justify-center " + data?.theme?.secondary}>
          <div className={"flex h-96 w-96 items-center justify-center " + data?.theme?.tertiary}>Home</div>
        </div>
      </div>
    </>
  );
};

export default Home;
