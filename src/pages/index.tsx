import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";

const Index: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return (
      <>
        <Head>
          <title>Clonegram</title>
          <meta name="description" content="Clonegram by Ushira Dineth" />
          <meta name="google-site-verification" content="WqjiADJh02W0ssceX3ZwKlqRFhVgDEEPUQjG8au1k80" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Spinner />;
        </main>
      </>
    );
  }

  if (status == "authenticated") {
    router.push("/home");
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
          <p className="text-sm text-white sm:text-2xl">Made with NextJS, TypeScript, tRPC, Zod and TailwindCSS</p>
          <Auth />
        </div>
      </main>
    </>
  );
};

export default Index;

const Auth: React.FC = () => {
  const { status } = useSession();
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
