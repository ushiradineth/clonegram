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
import ProfileLink from "../../components/ProfileLink";
import { AiOutlineHeart } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import InputBox from "../../components/InputBox";

const Post = () => {
  const [imageIndex, setImageIndex] = useState(0);

  const router = useRouter();
  const postID = router.query.post as string;
  const { data: session } = useSession();
  const data = useContext(DataContext);
  const post = trpc.post.getPost.useQuery({ id: postID }, { retry: false, refetchOnWindowFocus: false });
  const follow = trpc.user.follow.useMutation({
    onSuccess: () => {
      data?.user?.refetch();
    },
  });
  const unfollow = trpc.user.unfollow.useMutation({
    onSuccess: () => {
      data?.user?.refetch();
    },
  });

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
            <div className={"flex h-[80%] w-[25%] flex-col justify-start rounded-r-2xl border-l border-zinc-600 " + data?.theme?.tertiary}>
              <div className="grid h-[13%] w-full border-b border-zinc-600">
                <ProfileLink
                  followState={
                    post.data?.user.handle === data?.user?.data.handle ? (
                      <></>
                    ) : data?.user?.data.following.find((e) => e.handle === post.data?.user.handle) ? (
                      <button className="text-blue-400 hover:text-blue-500" onClick={() => unfollow.mutate({ userid: data.user?.data.id || "", pageid: post.data?.userId || "" })}>
                        following
                      </button>
                    ) : (
                      <button className="text-blue-400 hover:text-blue-500" onClick={() => follow.mutate({ userid: data?.user?.data.id || "", pageid: post.data?.userId || "" })}>
                        follow
                      </button>
                    )
                  }
                  user={{ userID: post.data?.user.id || "", userName: post.data?.user.name || "", userImage: post.data?.user.image || "", userHandle: post.data?.user.handle || "" }}
                  index={0}
                  onClickHandlerPost={() => router.push({ pathname: "/" + post.data?.user.handle })}
                />
              </div>
              <div className="grid h-[70%] w-full place-items-center border-b border-zinc-600 pb-8">
                <p>No Comments Yet</p>
              </div>
              <div className="grid h-[13%] w-full border-b border-zinc-600">
                <div className="grid grid-flow-col">
                  <div className="grid h-fit w-fit scale-[1.6] grid-flow-col gap-2 pt-3 pl-6 child-hover:text-zinc-600">
                    <AiOutlineHeart />
                    <TbMessageCircle2 />
                    <IoPaperPlaneOutline />
                  </div>
                  <div className="ml-[280px] grid h-fit w-fit scale-[1.6] grid-flow-col pt-3 hover:text-zinc-600">
                    <BsBookmark />
                  </div>
                </div>
                <p className="pl-3 font-mono text-xs text-zinc-300">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(post.data?.createdAt.getMonth()).toUpperCase() + " " + post.data?.createdAt.getDate() + ", " + post.data?.createdAt.getFullYear()} </p>
              </div>
              <div className="flex h-[7%] items-center">
                <div className="w-[90%]">
                  <InputBox id="comment" maxlength={200} placeholder="Add a comment..." minlength={1} />
                </div>
                <button className="text-blue-300">Post</button>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return <Spinner />;
};

export default Post;
