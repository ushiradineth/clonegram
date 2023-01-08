import Head from "next/head";
import { DataContext } from "../pages/_app";
import { useContext } from "react";

interface itemType {
  error: string;
  session: boolean;
}

const Error = (props: itemType) => {
  const data = useContext(DataContext);

  return (
    <>
      <Head>
        <title>Error • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"grid h-screen place-items-center text-3xl font-light " + data?.theme?.secondary + (data?.viewport == "Web" && props.session && " ml-72 ") + (data?.viewport == "Tab" && props.session && " ml-16 ")}>{props.error}</main>
    </>
  );
};

export default Error;
