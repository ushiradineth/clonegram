import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import { env } from "../env/client.mjs";
import { AiFillGithub, AiFillGoogleCircle, AiOutlineTwitter } from "react-icons/ai";
import Link from "next/link";
import React from "react";

const Auth = () => {
  const { status } = useSession();

  if (status == "loading") {
    return <Spinner />;
  }

  const CTAs = () => {
    const Item = (props: { icon: JSX.Element; text: string, provider: string }) => {
      return (
        <button className="flex w-full select-none items-center justify-center gap-2 rounded-full bg-white from-red-300 via-pink-300 to-orange-100 px-8 py-3 font-semibold text-black no-underline transition hover:bg-gradient-to-br" onClick={() => signIn(props.provider, { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
          {props.icon}
          {props.text}
        </button>
      );
    };

    return (
      <section className="grid w-[350px] gap-2 rounded px-6 pb-6 pt-2">
        <Item icon={<AiFillGoogleCircle size={30} />} text={"Continue with Google"} provider={"google"} />
        <Item icon={<AiFillGithub size={30} />} text={"Continue with Github"} provider={"github"} />
        <Item icon={<AiOutlineTwitter size={30} />} text={"Continue with Twitter"} provider={"twitter"} />
      </section>
    );
  };

  const Links = () => {
    return (
      <div className="fixed bottom-0 grid h-fit w-fit grid-flow-col place-items-center gap-4 p-4 font-semibold text-white">
        <Link href={"/about"}>About</Link>
        <Link href={"/privacy"}>Privacy</Link>
      </div>
    );
  };

  const Objects = () => {
    return (
      <div>
        <div className="animate-float-fastest">
          <div className="absolute inset-auto h-60 w-60 -translate-x-8 translate-y-16 scale-50 rounded-full bg-gradient-to-br from-red-300 via-pink-400 to-purple-200 sm:translate-x-20 sm:translate-y-28 sm:scale-100"></div>
        </div>

        <div className="scale-50 animate-float-fast sm:scale-100">
          <div className="absolute inset-auto h-60 w-60 -translate-x-56 -translate-y-16 scale-50 rounded-full bg-gradient-to-tr from-red-300 via-pink-300 to-orange-100 sm:-translate-x-80 sm:-translate-y-28 sm:scale-100"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <meta name="google-site-verification" content="WqjiADJh02W0ssceX3ZwKlqRFhVgDEEPUQjG8au1k80" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" grid h-screen w-screen select-none bg-[#171717]">
        <div className={"grid place-content-center place-items-center gap-4"}>
          <Objects />
          <div className="z-10 flex h-full w-full flex-col items-center justify-center rounded-lg shadow-2xl backdrop-blur-2xl">
            <div className="grid h-fit w-fit grid-flow-col place-items-center gap-2 rounded-lg">
              <h1 className="p-8 text-5xl font-extrabold tracking-tight text-white">
                Clone<span className="bg-gradient-to-br from-red-300 via-pink-300 to-orange-100 bg-clip-text text-transparent">gram</span>
              </h1>
            </div>
            <CTAs />
          </div>
          <Links />
        </div>
      </main>
    </>
  );
};

export default Auth;
