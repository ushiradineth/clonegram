import Head from "next/head";

interface itemType {
  viewport: string;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  error: string;
  session: boolean;
}

const Error = (props: itemType) => {
  return (
    <>
      <Head>
        <title>Error • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"grid h-screen place-items-center text-3xl font-light " + props.theme.secondary + (props.viewport == "Web" && props.session && " ml-72 ") + (props.viewport == "Tab" && props.session && " ml-16 ")}>{props.error}</main>
    </>
  );
};

export default Error;
