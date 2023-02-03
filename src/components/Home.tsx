import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";
import { Post } from "@prisma/client";
import PostItem from "./PostItem";
import { FiCamera } from "react-icons/fi";

const Home = () => {
  const { status, data: session } = useSession();
  const data = useContext(DataContext);
  const posts = trpc.post.getHomeFeed.useQuery({ id: session?.user?.id || "" }, { retry: false, refetchOnWindowFocus: false });
  if (typeof data?.user?.data === "undefined") location.reload();

  if (posts.isLoading) return <Spinner />;
  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Home • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"flex min-h-screen flex-col items-center justify-center py-8 " + data?.theme?.primary + (data?.viewport == "Web" && session && " ml-72 ") + (data?.viewport == "Tab" && session && " ml-16 ")}>
        <div className="mx-16 pt-12 pb-4">
          {posts.data?.q1.map((post: Post, index: number) => {
            return (
              <div key={index}>
                <PostItem key={index} post={{ data: post, isLoading: posts.isLoading, isError: posts.isError, isSuccess: posts.isSuccess, isFetching: posts.isFetching }} />
              </div>
            );
          })}

          {posts.data?.q1.length === 0 && (
            <div className="min-w-screen col-span-3 my-2 flex w-full flex-col items-center rounded-xl border-2 border-zinc-700 p-2">
              <div className="text-center text-xl font-semibold ">{(data?.user?.data.following.length || 0) > 0 ? "None of the accounts you follow have posted recently" : "Follow some accounts to see their posts here"}</div>
            </div>
          )}

          {posts.data?.q2.length !== 0 && (
            <div className="min-w-screen col-span-3 flex w-full flex-col items-center rounded-xl border-2 border-zinc-700 p-2">
              <div className="text-center text-xl font-semibold">See some posts from other users on this platform</div>
            </div>
          )}

          {posts.data?.q2.map((post: Post, index: number) => {
            return (
              <div key={index}>
                <PostItem key={index} post={{ data: post, isLoading: posts.isLoading, isError: posts.isError, isSuccess: posts.isSuccess, isFetching: posts.isFetching }} />
              </div>
            );
          })}

          {posts.data?.q1.length === 0 && posts.data?.q2.length === 0 && (
            <div className="min-w-screen col-span-3 flex w-full flex-col items-center">
              <>
                <div className="mb-4 mt-8 grid h-32 w-32 place-items-center rounded-full border-4">
                  <FiCamera className="scale-x-[-5] scale-y-[5] transform" />
                </div>
                <div className="text-xl font-semibold">No posts yet</div>
              </>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
