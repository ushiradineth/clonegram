import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";

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
}

interface authItemType {
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
}

const Index = (props: itemType) => {
  const { status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return <Spinner theme={props.theme} />;
  }

  if (status == "authenticated") {
    router.push("/home");
    return <></>
  }

  return (
    <>
      <Head>
        <title>Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <meta name="google-site-verification" content="WqjiADJh02W0ssceX3ZwKlqRFhVgDEEPUQjG8au1k80" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="grid place-items-center gap-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Clone<span className="text-[hsl(280,100%,70%)]">gram</span>
          </h1>
          <div className="grid place-items-center text-sm text-white sm:text-2xl">
            <h1>Made with NextJS, TypeScript, NextAuth, tRPC, Zod and TailwindCSS</h1>
            <h1>Database and storage on Supabase</h1>
            <h1>Hosted on Vercel</h1>
          </div>
          <Auth theme={props.theme} />
        </div>
      </main>
    </>
  );
};

export default Index;

const Auth = (props: authItemType) => {
  const { status } = useSession();
  if (status == "loading") {
    return <Spinner theme={props.theme} />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => signIn("google", { callbackUrl: "http://localhost:3000/" })}>
        Sign in
      </button>
    </div>
  );
};
