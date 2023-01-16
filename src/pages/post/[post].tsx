import React, { useState } from "react";
import { DataContext } from "../_app";
import { useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
import Spinner from "../../components/Spinner";

const Post = () => {
  const router = useRouter();
  const postID = router.query.post as string;
  const data = useContext(DataContext);
  const post = trpc.post.getPost.useQuery({ id: postID });
  const { data: session, status } = useSession();
  const [imageIndex, setImageIndex] = useState(0);

  if (post.isSuccess) {
    return (
      <>
        <Head>
          <title>{`${post?.data?.user.handle} on Clonegram`}</title>
          <meta name="description" content="Clonegram by Ushira Dineth" />
          <link rel="icon" href={"/favicon.ico"} />
        </Head>
        <main>
          {!session && (
            <div className={"fixed bottom-0 left-0 flex h-12 w-screen items-center justify-center gap-2 " + data?.theme?.primary}>
              Sign in to Clonegram to see more!
              <button className={"rounded-full px-4 py-2 font-semibold no-underline transition " + data?.theme?.tertiary} onClick={() => router.push("/")}>
                Sign in
              </button>
            </div>
          )}

          <div className={"flex h-screen select-none items-center justify-center " + data?.theme?.secondary + (data?.viewport == "Web" && session && " ml-72 ") + (data?.viewport == "Tab" && session && " ml-16 ")}>
            <div className={"flex h-[80%] w-[50%] transform items-center justify-center rounded-l-2xl " + data?.theme?.tertiary}>
              <div className="flex h-fit w-fit items-center justify-center p-2 transition-all duration-300">
                <BiChevronLeft onClick={() => imageIndex > 0 && setImageIndex(imageIndex - 1)} className={"fixed left-4 top-[53%] z-20 h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex > 0 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
                <BiChevronRight onClick={() => imageIndex < (post.data?.imageURLs.length || 0) - 1 && setImageIndex(imageIndex + 1)} className={"fixed top-[53%] right-4 z-20 h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex < (post.data?.imageURLs.length || 0) - 1 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
                <Image src={post.data?.imageURLs[imageIndex] || ""} key="image" className="h-fit max-h-[700px]  w-fit" height={1000} width={1000} alt={"images"} />
              </div>
            </div>
            <div className="flex h-[80%] w-[25%] items-center rounded-r-2xl bg-red-300"></div>
          </div>
        </main>
      </>
    );
  }

  return <Spinner />;
};

export default Post;
