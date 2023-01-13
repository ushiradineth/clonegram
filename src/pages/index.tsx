import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import { env } from "../env/client.mjs";
import { AiFillGithub, AiFillGoogleCircle, AiOutlineTwitter } from "react-icons/ai";
import Link from "next/link";

const Index = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return <Spinner />;
  }

  if (status == "authenticated") {
    router.push("/home");
    return <div className="h-screen w-screen bg-zinc-700"></div>;
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
          <div className="grid w-full place-items-center gap-6 text-lg text-white sm:text-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Clone<span className="text-[hsl(280,100%,70%)]">gram</span>
            </h1>
            <h1 className="font-semibold">IN DEVELOPMENT</h1>
            <div>
              <div className="flex w-[423px] flex-col items-center justify-center gap-4 text-base">
                <button className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => signIn("google", { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
                  <AiFillGoogleCircle size={30} /> Sign in with Google (waiting for approval)
                </button>
                <button className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => signIn("twitter", { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
                  <AiOutlineTwitter size={30} /> Sign in with Twitter (waiting for approval)
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => signIn("github", { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
                  <AiFillGithub size={30} /> Sign in with GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 grid h-fit w-fit grid-flow-col place-items-center gap-4 p-4 font-semibold text-white">
          <Link href={"/about"}>About</Link>
          <Link href={"/privacy"}>Privacy</Link>
        </div>
      </main>
    </>
  );
};

export default Index;
