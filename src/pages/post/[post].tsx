import React, { useEffect, useState } from "react";
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
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import InputBox from "../../components/InputBox";

const Post = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [like, setLike] = useState<boolean | null>(null);

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

  const likePost = trpc.post.likePost.useMutation({
    onMutate: () => {
      setLike(true);
    },
  });

  const unlikePost = trpc.post.unlikePost.useMutation({
    onMutate: () => {
      setLike(false);
    },
  });

  useEffect(() => {
    post.data?.likes.forEach((e) => e.id === data?.user?.data.id && setLike(true));
  }, [post]);

  const ProfileView = () => {
    return (
      <ProfileLink
        hideName={true}
        truncate={post.data?.user.handle === data?.user?.data.handle}
        followState={
          post.data?.user.handle === data?.user?.data.handle ? (
            <></>
          ) : data?.user?.data.following.find((e) => e.handle === post.data?.user.handle) ? (
            <button className="ml-1 flex gap-2" onClick={() => unfollow.mutate({ userid: data.user?.data.id || "", pageid: post.data?.userId || "" })}>
              <p>•</p>
              <p className="text-blue-400 hover:text-blue-500">following</p>
            </button>
          ) : (
            <button className="flex gap-2" onClick={() => follow.mutate({ userid: data?.user?.data.id || "", pageid: post.data?.userId || "" })}>
              <p>•</p>
              <p className="text-blue-400 hover:text-blue-500"> follow</p>
            </button>
          )
        }
        user={{ userID: post.data?.user.id || "", userName: post.data?.user.name || "", userImage: post.data?.user.image || "/image-placeholder.png", userHandle: post.data?.user.handle || "" }}
        index={0}
        onClickHandlerPost={() => router.push({ pathname: "/" + post.data?.user.handle })}
      />
    );
  };

  const MobileHeader = () => {
    return (
      <div className={"z-10 flex h-fit w-[400px] items-center justify-start rounded-t-2xl border-b border-zinc-600 pl-4 pb-4 " + (data?.viewport !== "Mobile" ? " hidden " : "") + data?.theme?.tertiary}>
        <ProfileView />
      </div>
    );
  };

  const Comments = () => {
    return (
      <div className={"grid h-[70%] w-full place-items-center border-zinc-600 " + (data?.viewport === "Mobile" ? " border-t p-4 " : " border-b ")}>
        <p>No Comments Yet</p>
      </div>
    );
  };

  const InteractionBar = () => {
    return (
      <div className="grid grid-flow-col">
        <div className="mt-4 grid h-fit w-fit scale-[1.6] grid-flow-col gap-2 pl-6 child-hover:text-zinc-600">
          {like ? <AiFillHeart className="cursor-pointer text-red-500" onClick={() => unlikePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} /> : <AiOutlineHeart className="cursor-pointer" onClick={() => likePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} />}
          <TbMessageCircle2 fill={showComments ? "white" : "none"} className="cursor-pointer" onClick={() => setShowComments(!showComments)} />
          <IoPaperPlaneOutline className="cursor-pointer" />
        </div>
        <div className={"mt-4 flex h-fit w-full items-center justify-end pr-3 hover:text-zinc-600"}>
          <BsBookmark className="scale-[1.6] cursor-pointer" />
        </div>
      </div>
    );
  };

  const MobileFooter = () => {
    return (
      <div className={"flex h-fit w-[400px] flex-col items-center justify-start rounded-b-2xl border-t border-zinc-600 " + (data?.viewport !== "Mobile" ? " hidden " : "") + data?.theme?.tertiary}>
        <div className="grid w-full border-zinc-600">
          <InteractionBar />
          <p className="mt-2 p-3 pb-2 font-mono text-xs text-zinc-300">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(post.data?.createdAt.getMonth()).toUpperCase() + " " + post.data?.createdAt.getDate() + ", " + post.data?.createdAt.getFullYear()} </p>
        </div>
        {showComments && <Comments />}
      </div>
    );
  };

  const WebSideView = () => {
    const Header = () => {
      return (
        <div className="grid h-[13%] w-full border-b border-zinc-600">
          <ProfileView />
        </div>
      );
    };

    const Interactions = () => {
      return (
        <div className="grid h-[15%] w-full border-b border-zinc-600">
          <InteractionBar />
          <p className="pl-3 mt-1 text-xs text-zinc-300">{post.data?.likes.length && (post.data?.likes.length + " " + (post.data?.likes.length > 1 ? "likes" : "like"))}</p>
          <p className="pl-3 font-mono text-xs text-zinc-300">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(post.data?.createdAt.getMonth()).toUpperCase() + " " + post.data?.createdAt.getDate() + ", " + post.data?.createdAt.getFullYear()} </p>
        </div>
      );
    };

    const CommentBox = () => {
      return (
        <div className="flex h-[7%] items-center">
          <div className="w-[90%]">
            <InputBox id="comment" maxlength={200} placeholder="Add a comment..." minlength={1} />
          </div>
          <button className="text-blue-300">Post</button>
        </div>
      );
    };

    return (
      <div className={"flex h-[700px] w-[350px] flex-col justify-start rounded-r-2xl border-l border-zinc-600 " + (data?.viewport === "Mobile" ? " hidden " : "") + data?.theme?.tertiary}>
        <Header />
        <Comments />
        <Interactions />
        <CommentBox />
      </div>
    );
  };

  const PostView = () => {
    return (
      <div className={"grid transform place-items-center " + (data?.viewport === "Mobile" ? "  h-[500px] w-[400px] " : "  h-[700px] w-[500px] rounded-l-2xl ") + data?.theme?.tertiary}>
        <div className={"flex h-fit w-fit items-center justify-center p-2 transition-all duration-300 " + (data?.viewport === "Mobile" ? "  max-h-[400px] max-w-[350px]" : " max-h-[650px] max-w-[450px] ")}>
          <BiChevronLeft onClick={() => imageIndex > 0 && setImageIndex(imageIndex - 1)} className={"fixed left-4 top-[50%] h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex > 0 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <BiChevronRight onClick={() => imageIndex < (post.data?.imageURLs.length || 0) - 1 && setImageIndex(imageIndex + 1)} className={"fixed top-[50%] right-4 h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex < (post.data?.imageURLs.length || 0) - 1 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <Image src={post.data?.imageURLs[imageIndex] || "/image-placeholder.png"} key="image" className="h-full w-full object-cover" height={1000} width={1000} alt={"images"} />
        </div>
      </div>
    );
  };

  const SignInNotification = () => {
    if (!session)
      return (
        <div className={"fixed bottom-0 left-0 flex h-12 w-screen items-center justify-center gap-2 " + data?.theme?.primary}>
          Sign in to Clonegram to see more!
          <button className={"rounded-full px-4 py-2 font-semibold no-underline transition " + data?.theme?.tertiary} onClick={() => router.push("/")}>
            Sign in
          </button>
        </div>
      );

    return <></>;
  };

  if (post.isSuccess) {
    return (
      <>
        <Head>
          <title>{`${post?.data?.user.handle} on Clonegram`}</title>
          <meta name="description" content="Clonegram by Ushira Dineth" />
          <link rel="icon" href={"/favicon.ico"} />
        </Head>
        <main>
          <SignInNotification />
          <div className={"flex h-screen select-none items-center px-2 " + data?.theme?.secondary + (data?.viewport == "Web" && session && " ml-72  justify-center ") + (data?.viewport == "Tab" && session && " ml-16 justify-center ") + (data?.viewport == "Mobile" && session && " flex-col pt-12 ")}>
            <MobileHeader />
            <PostView />
            <WebSideView />
            <MobileFooter />
          </div>
        </main>
      </>
    );
  }

  return <Spinner />;
};

export default Post;
