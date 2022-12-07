import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Loading from "./loading";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status == "loading") {
    return <Loading />;
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
            <Main />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const Main: React.FC = () => {
  //redirecting to index if not authenticated
  const { data: session, status } = useSession();
  if (status == "loading") {
    return <Loading />;
  }

  const router = useRouter();
  if (status == "unauthenticated") {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-sm text-white sm:text-2xl">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
      >
        Sign out
      </button>
    </div>
  );
};

// const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
// {hello.data ? hello.data.greeting : "Loading tRPC query..."}
// const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//   undefined, // no input
//   { enabled: sessionData?.user !== undefined }
// );
// {secretMessage && <span> - {secretMessage}</span>}
