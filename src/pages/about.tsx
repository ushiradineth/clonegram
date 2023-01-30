import Head from "next/head";
import Link from "next/link";
import React from "react";
import { AiFillGithub, AiFillLinkedin, AiOutlineLink } from "react-icons/ai";
import { HiChevronLeft } from "react-icons/hi";

const about = () => {
  return (
    <>
      <Head>
        <title>About • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <h1 className="flex w-full justify-center border-b-2 p-4 font-semibold">
          <p>About clonegram</p>
          <Link href="/" passHref>
            <HiChevronLeft className="fixed right-8 mt-1 scale-150" />
          </Link>
        </h1>
        <div className="flex h-[90%] flex-col items-start bg-zinc-900 px-4 font-light text-white">
          <h1 className="py-4 text-3xl font-semibold">About</h1>
          <p className="text-lg">Web application replicating Instagram built with</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li>
              <p className="text-lg">NextJS</p>
            </li>
            <li>
              <p className="text-lg">TypeScript</p>
            </li>
            <li>
              <p className="text-lg">NextAuth</p>
            </li>
            <li>
              <p className="text-lg">tRPC</p>
            </li>
            <li>
              <p className="text-lg">Zod</p>
            </li>
            <li>
              <p className="text-lg">TailwindCSS</p>
            </li>
            <li>
              <p className="text-lg">
                Database and storage on <span className="font-semibold">Supabase</span>. Hosted on <span className="font-semibold">Vercel</span>.
              </p>
            </li>
          </ul>
          <h1 className="fixed left-0 bottom-0 flex w-screen items-center justify-center gap-2 bg-white p-4 font-semibold text-black">
            Made by Ushira Dineth
            <Link className="text-lg" href="https://www.github.com/ushiradineth" target="_blank" passHref>
              <AiFillGithub />
            </Link>
            <Link className="text-lg" href="https://www.linkedin.com/in/ushiradineth/" target="_blank" passHref>
              <AiFillLinkedin />
            </Link>
            <Link className="text-lg" href="https://ushiradineth.github.io" target="_blank" passHref>
              <AiOutlineLink />
            </Link>
            <Link href="mailto:ushiradineth@gmail.com" target="_blank">
              ushiradineth@gmail.com
            </Link>
          </h1>
        </div>
      </main>
    </>
  );
};

export default about;
