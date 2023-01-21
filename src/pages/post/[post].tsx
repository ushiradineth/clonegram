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
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import InputBox from "../../components/InputBox";
import Error from "../../components/Error";
import Link from "next/link";

const Post = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [like, setLike] = useState<boolean | null>(null);
  const [save, setSave] = useState<boolean | null>(null);

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

  const savePost = trpc.post.savePost.useMutation({
    onMutate: () => {
      setSave(true);
    },
  });

  const unsavePost = trpc.post.unsavePost.useMutation({
    onMutate: () => {
      setSave(false);
    },
  });

  const comment = trpc.post.setcomment.useMutation({});

  useEffect(() => {
    post.data?.likes.forEach((e) => e.id === data?.user?.data.id && setLike(true));
    post.data?.saved.forEach((e) => e.id === data?.user?.data.id && setSave(true));
  }, [post]);

  if (!post.data && !post.isLoading) return <Error session={Boolean(session)} error="Post not found" />;
  if (post.isLoading) return <Spinner />;

  const ProfileView = () => {
    return (
      <div className={"mt-5 flex h-12 w-fit items-center justify-center px-4 "}>
        <Image className={"h-12 w-12 cursor-pointer rounded-full"} onClick={() => router.push("/" + post.data?.user.handle)} src={post.data?.user.image || ""} height={160} width={160} alt="Profile Picture" priority />
        <div className="m-4 flex w-full flex-col justify-center gap-1 truncate">
          <div className="flex gap-2">
            <Link passHref href={"/" + post.data?.user.handle} onClick={(e) => e.preventDefault()} className={"cursor-pointer " + post.data?.user.handle !== data?.user?.data.handle ? " w-[60%] " : ""}>
              {post.data?.user.handle}
            </Link>
            {post.data?.user.handle === data?.user?.data.handle ? (
              <></>
            ) : data?.user?.data.following.find((e) => e.handle === post.data?.user.handle) ? (
              <div className="flex gap-2">
                <p>•</p>
                <button className="cursor-pointer text-blue-400 hover:text-blue-500 disabled:cursor-not-allowed disabled:text-blue-300" disabled={follow.isLoading || unfollow.isLoading} onClick={() => unfollow.mutate({ userid: data.user?.data.id || "", pageid: post.data?.userId || "" })}>
                  following
                </button>
              </div>
            ) : (
              <button className="flex gap-2">
                <p>•</p>
                <button className="cursor-pointer text-blue-400 hover:text-blue-500 disabled:cursor-not-allowed disabled:text-blue-300 " disabled={follow.isLoading || unfollow.isLoading} onClick={() => follow.mutate({ userid: data?.user?.data.id || "", pageid: post.data?.userId || "" })}>
                  follow
                </button>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Comment = (props: { text: string; handle: string; image: string }) => {
    return (
      <>
        <Link passHref href={"/" + props.handle} onClick={(e) => e.preventDefault()}>
          <Image className={"h-fit w-12 cursor-pointer rounded-full"} onClick={() => router.push("/" + props.handle)} src={props.image} height={160} width={160} alt="Profile Picture" priority />
        </Link>
        <div className="flex gap-2">
          <span className="break-all">
            <Link passHref href={"/" + props.handle} onClick={(e) => e.preventDefault()} className="mr-2 h-fit w-fit truncate font-semibold">
              {props.handle}
            </Link>
            {props.text}
          </span>
        </div>
      </>
    );
  };

  const Comments = () => {
    return (
      <>
        {post.data?.caption && (
          <div className={"flex h-24 gap-4 overflow-y-auto pt-4 pl-6 pr-2 " + (data?.viewport === "Mobile" ? " hidden " : "")}>
            <Comment key={"caption"} text={post.data.caption} handle={post.data.user.handle} image={post.data.user.image || "/image-placeholder.png"} />
          </div>
        )}
        {post.data?.comments.length ? (
          post.data.comments
            .slice(0)
            .reverse()
            .map((element, index) => {
              console.log(element);
              return <Comment key={index} text={element.id || ""} handle={element.userId} image={"/image-placeholder.png" || "/image-placeholder.png"} />;
            })
        ) : (
          <div className={"grid h-[70%] w-full place-items-center border-zinc-600 " + (data?.viewport === "Mobile" ? " border-t p-4 " : " border-b ")}>
            <p>No Comments Yet</p>
          </div>
        )}
      </>
    );
  };

  const CommentBox = () => {
    return (
      <div className={"flex w-full items-center " + (data?.viewport === "Mobile" ? "" : " h-[7%] ")}>
        <div className={data?.viewport === "Mobile" ? " z-10 w-[88%] " : " w-[86%] "}>
          <InputBox id="comment" maxlength={200} placeholder="Add a comment..." minlength={1} />
        </div>
        <button className="z-10 text-blue-500" onClick={() => (document.getElementById("comment") as HTMLInputElement).value.length > 0 && comment.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "", text: (document.getElementById("comment") as HTMLInputElement).value })}>
          Post
        </button>
      </div>
    );
  };

  const InteractionBar = () => {
    return (
      <>
        <div className="grid grid-flow-col">
          <div className={"mt-4 grid h-fit w-fit scale-[1.6] grid-flow-col gap-2 child-hover:text-zinc-600 " + (data?.viewport !== "Mobile" ? " pl-4 " : "  pl-6 ")}>
            {like ? <AiFillHeart className="cursor-pointer text-red-500" onClick={() => unlikePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} /> : <AiOutlineHeart className="cursor-pointer" onClick={() => likePost.mutate({ userid: data?.user?.data.id || "", postOwnerid: post.data?.userId || "", postid: post.data?.id || "" })} />}
            <TbMessageCircle2 fill={showComments ? "white" : "none"} className={"cursor-pointer " + (data?.viewport !== "Mobile" ? " hidden " : "")} onClick={() => setShowComments(!showComments)} />
            <IoPaperPlaneOutline className="cursor-pointer" />
          </div>
          <div className={"mt-4 flex h-fit w-full items-center justify-end pr-3 hover:text-zinc-600"}>{save ? <BsBookmarkFill fill="white" className="scale-[1.6] cursor-pointer " onClick={() => unsavePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} /> : <BsBookmark className="scale-[1.6] cursor-pointer " onClick={() => savePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} />}</div>
        </div>
        <div className="pb-3 pt-2">
          {(post.data?.likes.length || 0) > 0 && <p className="mt-1 pl-3 text-xs text-zinc-300">{(post.data?.likes.length || 0) > 0 && post.data?.likes.length + " " + ((post.data?.likes.length || 0) > 1 ? "likes" : "like")}</p>}
          <p className="pl-3 font-mono text-xs text-zinc-300">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(post.data?.createdAt.getMonth()).toUpperCase() + " " + post.data?.createdAt.getDate() + ", " + post.data?.createdAt.getFullYear()} </p>
        </div>
      </>
    );
  };

  const MobileHeader = () => {
    return (
      <div className={"z-10 flex h-fit w-[400px] items-center justify-start rounded-t-2xl border-b border-zinc-600 pl-4 pb-5 " + (data?.viewport !== "Mobile" ? " hidden " : "") + data?.theme?.tertiary}>
        <ProfileView />
      </div>
    );
  };

  const MobileFooter = () => {
    return (
      <div className={"flex h-fit w-[400px] flex-col items-center justify-start rounded-b-2xl border-t border-zinc-600 " + (data?.viewport !== "Mobile" ? " hidden " : "") + data?.theme?.tertiary}>
        <div className={"mb-3 grid w-full border-zinc-600 " + (showComments ? " h-[90px]  border-b " : "  h-[80px] ")}>
          <InteractionBar />
        </div>
        {showComments && (
          <>
            <div className="w-full pb-2">
              <CommentBox />
            </div>
            <Comments />
          </>
        )}
      </div>
    );
  };

  const WebSideView = () => {
    const Header = () => {
      return (
        <div className="grid h-[15%] w-full border-b border-zinc-600 pl-2">
          <ProfileView />
        </div>
      );
    };

    const Interactions = () => {
      return (
        <div className="grid h-[15%] w-full border-b border-zinc-600">
          <InteractionBar />
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
