import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import { trpc } from "../utils/trpc";
import Spinner from "../components/Spinner";
import { type Post } from "@prisma/client";
import PostItem from "../components/PostItem";
import { FiCamera } from "react-icons/fi";

const Explore = () => {
  const { status, data: session } = useSession();
  const data = useContext(DataContext);
  const posts = trpc.post.getExploreFeed.useQuery({ id: session?.user?.id || "" }, { retry: false, refetchOnWindowFocus: false });
  if (typeof data?.user?.data === "undefined") location.reload();

  if (posts.isLoading) return <Spinner />;
  if (status === "unauthenticated") router.push("/");

  return (
    <>
      <Head>
        <title>Explore • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"flex min-h-screen items-center justify-center py-8 " + data?.theme?.secondary + (data?.viewport == "Web" && session && " ml-72 ") + (data?.viewport == "Tab" && session && " ml-16 ")}>
        <div className="mx-16 flex flex-col gap-2 pt-12 pb-4">
          {posts.data?.map((post: Post, index: number) => {
            return (
              <div key={index}>
                <PostItem key={index} post={{ data: post, isLoading: posts.isLoading, isError: posts.isError, isSuccess: posts.isSuccess, isFetching: posts.isFetching }} />
              </div>
            );
          })}

          {posts.data?.length === 0 && (
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

export default Explore;
