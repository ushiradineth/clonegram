import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import NavBar from "../components/NavBar";
import Spinner from "../components/Spinner";

// const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
// {hello.data ? hello.data.greeting : "Loading tRPC query..."}
// const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//   undefined, // no input
//   { enabled: sessionData?.user !== undefined }
// );
// {secretMessage && <span> - {secretMessage}</span>}

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  if (status == "loading") {
    return <Spinner />;
  }

  if (!hello.data) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 sm:gap-12 ">
          <div className="flex flex-col items-center gap-2">
            <NavBar />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
