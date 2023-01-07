import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import React, { useEffect } from "react";

interface itemType {
  viewport: string;
  supabase: unknown;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  user: any;
}

const Home = (props: itemType) => {
  const { data: session, status } = useSession();

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
      <div className={"select-none " + (props.viewport == "Web" && " ml-72 ") + (props.viewport == "Tab" && " ml-16 ")}>
        <div id="Background" className={"flex min-h-screen flex-col items-center justify-center " + props.theme.secondary}>
          <div className={"flex h-96 w-96 items-center justify-center " + props.theme.tertiary}>Home</div>
        </div>
      </div>
    </>
  );
};

export default Home;
