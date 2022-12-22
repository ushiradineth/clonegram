import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import Main from "../components/Main";

const Index: NextPage = () => {
  const { data: session, status } = useSession();

  if (status == "loading") {
    return <Spinner />;
  }

  if (status == "authenticated") {
    return (
      <>
        <Head>
          <title>Clonegram</title>
          <meta name="description" content="Clonegram by Ushira Dineth" />
          <meta name="google-site-verification" content="WqjiADJh02W0ssceX3ZwKlqRFhVgDEEPUQjG8au1k80" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Main />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <meta name="google-site-verification" content="WqjiADJh02W0ssceX3ZwKlqRFhVgDEEPUQjG8au1k80" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 sm:gap-12 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Clone<span className="text-[hsl(280,100%,70%)]">gram</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-white sm:text-2xl">Made with NextJS, TypeScript, tRPC, Zod and TailwindCSS</p>
            <Auth />
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;

const Auth: React.FC = () => {
  //redirecting to home if authenticated
  const { data: session, status } = useSession();
  if (status == "loading") {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => signIn("google", { callbackUrl: "http://localhost:3000/" })}>
        Sign in
      </button>
    </div>
  );
};
