import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import { env } from "../env/client.mjs";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";

const Auth = () => {
  const { status } = useSession();
  const [msg, setMsg] = useState("");

  if (status == "loading") {
    return <Spinner />;
  }

  const CTAs = () => {
    const Item = (props: { icon: JSX.Element; text: string; provider: string }) => {
      return (
        <button className="flex w-full select-none items-center justify-center gap-2 rounded-full bg-white from-red-300 via-pink-300 to-orange-100 px-8 py-3 font-semibold text-black no-underline transition hover:bg-gradient-to-br" onClick={() => signIn(props.provider, { callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })}>
          {props.icon}
          {props.text}
        </button>
      );
    };

    const MagicEmail = () => {
      const [emailValidation, setEmailValidation] = useState(false);
      const onChange = (e: { target: { name: any; value: any } }) => {
        if (e.target.name === "email") {
          const bState = z.string().email().safeParse(e.target.value);
          if (emailValidation !== bState.success) {
            setEmailValidation(bState.success);
          }
        }
      };

      const onSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        signIn("email", { email: (document.getElementById("email") as HTMLInputElement).value, redirect: false });
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1000);
        setMsg("Magic link sent, Check your Email.");
      };

      return (
        <form className="mt-3 grid w-full gap-1 px-6 text-center" onSubmit={onSubmit}>
          <input type="email" name="email" id="email" placeholder="Email" className={"focus:shadow-outline w-full appearance-none rounded-full border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"} onChange={onChange} />
          <p className={"font-semibold text-green-500"}>{msg}</p>
          <button type="submit" disabled={!emailValidation} className="font-semiboldno-underline focus:shadow-outline flex w-full select-none items-center justify-center rounded-full bg-blue-500 from-red-300 via-pink-300 to-orange-100 px-2 py-3 font-semibold text-white transition hover:bg-gradient-to-br hover:text-black focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300">
            Magic Link
          </button>
        </form>
      );
    };

    const Divider = () => {
      return (
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 flex-shrink select-none text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
      );
    };

    return (
      <>
        <MagicEmail />
        <Divider />
        <section className="grid w-[350px] gap-2 rounded px-6 pb-6 pt-2">
          <Item icon={<AiFillGoogleCircle size={30} />} text={"Continue with Google"} provider={"google"} />
          <Item icon={<AiFillGithub size={30} />} text={"Continue with Github"} provider={"github"} />
        </section>
      </>
    );
  };

  const Links = () => {
    return (
      <div className="grid h-fit w-fit grid-flow-col place-items-center gap-4 p-4 font-semibold text-white">
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

      <main className="flex select-none flex-col sm:flex-row">
        <div className="grid w-screen h-screen place-items-center bg-[#171717] gap-2">
          <div className="p-5 text-white text-2xl">
            <p className="text-4xl">
              Welcome to Clone<span className="bg-gradient-to-br from-red-300 via-pink-300 to-orange-100 bg-clip-text text-transparent">gram</span>
            </p>
            <p>
              An Instagram-like app made for learning purposes by{" "}
              <Link className="font-semibold" href={"https://www.github.com/ushiradineth"}>
                Ushira Dineth
              </Link>
            </p>
            <p>Built using Next12</p>
          </div>
        </div>
        <div className={"grid w-screen h-screen place-content-center place-items-center gap-4  bg-[#000000]"}>
          {/* <Objects /> */}
          <div className="z-10 flex h-full max-w-screen-sm flex-col items-center justify-center rounded-lg shadow-2xl backdrop-blur-2xl">
            <div className="grid h-fit w-fit max-w-screen-sm grid-flow-col place-items-center gap-2 rounded-lg">
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
