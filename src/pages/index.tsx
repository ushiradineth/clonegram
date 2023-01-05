import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import { env } from "../env/client.mjs";
import { AiFillGithub, AiFillGoogleCircle, AiOutlineTwitter } from "react-icons/ai";

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

const Index = (props: itemType) => {
  const { status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return <Spinner theme={props.theme} />;
  }

  if (status == "authenticated") {
    router.push("/home");
    return <div className={"h-screen w-screen " + props.theme.secondary}></div>;
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
        <div className="grid grid-flow-col place-items-center">
          <div className="grid place-items-center gap-6 text-sm text-white sm:text-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Clone<span className="text-[hsl(280,100%,70%)]">gram</span>
            </h1>
            <h1 className="font-semibold">IN DEVELOPMENT</h1>
            <div className="grid place-items-center">
              <h1>Made with NextJS, TypeScript, NextAuth, tRPC, Zod and TailwindCSS</h1>
              <h1>Database and storage on Supabase</h1>
              <h1>Hosted on Vercel</h1>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center gap-4 text-base w-[423px]">
                <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 flex items-center justify-center gap-2" onClick={() => signIn("google", { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
                <AiFillGoogleCircle size={30} /> Sign in with Google (waiting for approval)
                </button>
                <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 flex items-center justify-center gap-2" onClick={() => signIn("twitter", { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
                <AiOutlineTwitter size={30} /> Sign in with Twitter (waiting for approval)
                </button>
                <button className="rounded-full w-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 flex items-center justify-center gap-2" onClick={() => signIn("github", { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
                <AiFillGithub size={30} />  Sign in with GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 grid h-20 w-screen grid-flow-col place-items-center px-[45%] text-white  ">
          <div>Privacy</div>
          <div>About</div>
        </div>
      </main>
    </>
  );
};

export default Index;
