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
import { MdOutlineDeleteOutline } from "react-icons/md";
import OptionMenu from "../../components/OptionMenu";
import ListOfUsers from "../../components/ListOfUsers";
import UnAuthedAlert from "../../components/UnAuthedAlert";
import moment from "moment";
import { type Theme, toast } from "react-toastify";
import { Comment, User } from "@prisma/client";

const Post = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [like, setLike] = useState<boolean | null>(null);
  const [save, setSave] = useState<boolean | null>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [deleteCommentMenu, setDeleteCommentMenu] = useState(false);
  const [likesMenu, setLikesMenu] = useState(false);

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

  const deletePost = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      router.push("/");
      data?.user?.refetch;
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

  const comment = trpc.post.setcomment.useMutation({
    onSuccess: () => {
      post.refetch();
    },
  });

  const deleteComment = trpc.post.deleteComment.useMutation({
    onSuccess: () => {
      post.refetch();
    },
  });

  useEffect(() => {
    post.data?.likes.forEach((e) => e.id === data?.user?.data.id && setLike(true));
    post.data?.saved.forEach((e) => e.id === data?.user?.data.id && setSave(true));
  }, [post]);

  if (!post.data && !post.isLoading) return <Error session={Boolean(session)} error="Post not found" />;
  if (post.isLoading) return <Spinner />;

  const ProfileView = () => {
    return (
      <div className={"relative flex h-full w-full items-center justify-center"}>
        <Image className={"h-12 w-12 cursor-pointer rounded-full"} onClick={() => router.push("/profile/" + data?.user?.data.handle)} src={post.data?.user.image || ""} height={160} width={160} alt="Profile Picture" priority />
        <div className="m-4 flex flex-col justify-center gap-1 truncate">
          <div className="flex gap-2">
            <Link passHref href={"/profile/" + post.data?.user.handle} className={"w-fit cursor-pointer " + post.data?.user.handle !== data?.user?.data.handle ? " overflow-hidden truncate " : ""}>
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

  const Comment = (props: { comment: Comment & { user: User } }) => {
    return (
      <div className="flex flex-col justify-center gap-2 p-4" key={props.comment.user.handle + props.comment.text}>
        <div className="flex items-center gap-2">
          <Link passHref href={"/profile/" + props.comment.user.handle} onClick={(e) => e.preventDefault()}>
            <Image className={"h-fit w-12 cursor-pointer rounded-full"} onClick={() => router.push("/profile/" + props.comment.user.handle)} src={props.comment.user.image || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/image-placeholder.png"} height={160} width={160} alt="Profile Picture" priority />
          </Link>
          <Link passHref href={"/profile/" + props.comment.user.handle} onClick={(e) => e.preventDefault()} className="mr-2 h-fit w-56 truncate font-semibold">
            {props.comment.user.handle}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="break-all">AasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasdAasdasdasdasdasd</span>
          {props.comment.user.handle === data?.user?.data.handle && <MdOutlineDeleteOutline className="cursor-pointer" onClick={() => setDeleteMenu(true)} />}
        </div>
      </div>
    );
  };

  const Comments = () => {
    return (
      <div className={"flex w-full flex-col overflow-auto border-zinc-600 " + (data?.viewport === "Mobile" ? " h-fit border-t " : " h-[70%] border-b ")}>
        {post.data?.caption && <div className={"flex h-fit w-full items-center justify-center gap-4 break-all border-b border-zinc-600 p-4 py-4"}>{post.data.caption}</div>}
        {post.data?.comments.length ? (
          post.data.comments
            .slice(0)
            .reverse()
            .map((element, index) => <Comment key={index} comment={element} />)
        ) : (
          <p className="flex w-full items-center justify-center p-4">No Comments Yet</p>
        )}
      </div>
    );
  };

  const CommentBox = () => {
    return (
      <div className={"flex w-full items-center " + (data?.viewport === "Mobile" ? "" : " h-[7%] ")}>
        <div className={" " + data?.theme?.primary + (data?.viewport === "Mobile" ? " z-10 w-[88%] " : " w-[86%] ")}>
          <InputBox id="commentInput" maxlength={200} placeholder="Add a comment..." minlength={1} />
        </div>
        <button className="z-10 cursor-pointer text-blue-500" onClick={() => (document.getElementById("commentInput") as HTMLInputElement).value.length > 0 && comment.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "", text: (document.getElementById("commentInput") as HTMLInputElement).value })}>
          Post
        </button>
      </div>
    );
  };

  const InteractionBar = () => {
    return (
      <div className="h-fit">
        <div className="grid grid-flow-col place-items-start">
          <div className={"mt-4 grid h-fit w-fit scale-[1.6] grid-flow-col gap-2 child-hover:text-zinc-600 " + (post.data?.user.handle === data?.user?.data.handle ? (data?.viewport !== "Mobile" ? " pl-6 " : "  pl-7 ") : data?.viewport !== "Mobile" ? " pl-4 " : "  pl-6 ")}>
            {likePost.isLoading || unlikePost.isLoading || post.isFetching ? <Spinner SpinnerOnly={true} size={4} /> : like ? <AiFillHeart className="cursor-pointer text-red-500" onClick={() => unlikePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} /> : <AiOutlineHeart className="cursor-pointer" onClick={() => likePost.mutate({ userid: data?.user?.data.id || "", postOwnerid: post.data?.userId || "", postid: post.data?.id || "" })} />}
            <TbMessageCircle2 fill={showComments ? "white" : "none"} className={"cursor-pointer " + (data?.viewport !== "Mobile" ? " hidden " : "")} onClick={() => setShowComments(!showComments)} />
            <IoPaperPlaneOutline
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => {
                    toast("Link Copied", { hideProgressBar: true, autoClose: 2000, type: "success", theme: (data?.theme?.type as Theme) || ("dark" as Theme) });
                  })
                  .catch(() => {
                    toast("Failed to copy the Link", { hideProgressBar: true, autoClose: 2000, type: "error", theme: (data?.theme?.type as Theme) || ("dark" as Theme) });
                  });
              }}
            />
            {post.data?.user.handle === data?.user?.data.handle && <MdOutlineDeleteOutline onClick={() => setDeleteMenu(true)} />}
          </div>
          <div className="mt-4 flex h-fit w-full items-center justify-end ">
            <div className={"mr-3 hover:text-zinc-600"}>{save ? <BsBookmarkFill fill="white" className="scale-[1.6] cursor-pointer " onClick={() => unsavePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} /> : <BsBookmark className="scale-[1.6] cursor-pointer " onClick={() => savePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} />}</div>
          </div>
        </div>
        <div className="my-3">
          {(post.data?.likes.length || 0) > 0 && (
            <div className="mt-1 cursor-pointer pl-3 text-xs" onClick={() => setLikesMenu(true)}>
              {(post.data?.likes.length || 0) > 0 && post.data?.likes.length + " " + ((post.data?.likes.length || 0) > 1 ? "LIKES" : "LIKE")}
            </div>
          )}
          <p className="mt-2 pl-3 font-mono text-xs uppercase text-zinc-500">{moment(post.data?.createdAt).fromNow()}</p> <p className="pl-3 font-mono text-xs text-zinc-500">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(post.data?.createdAt.getMonth()).toUpperCase() + " " + post.data?.createdAt.getDate() + ", " + post.data?.createdAt.getFullYear()} </p>
        </div>
      </div>
    );
  };

  const MobileHeader = () => {
    return (
      <div className={"z-10 flex h-fit w-[90%] items-center justify-start rounded-t-2xl border-b border-zinc-600 p-4 sm:w-full " + (data?.viewport !== "Mobile" ? " hidden " : "") + data?.theme?.primary}>
        <ProfileView />
      </div>
    );
  };

  const MobileFooter = () => {
    return (
      <div className={"flex h-fit w-[90%] flex-col items-center justify-start rounded-b-2xl border-t border-zinc-600 sm:w-full " + (data?.viewport !== "Mobile" ? " hidden " : "") + data?.theme?.primary}>
        <div className={"grid h-fit w-full border-zinc-600 " + (showComments && " border-b ")}>
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
      <div className={"flex h-[700px] w-[350px] flex-col justify-start rounded-r-2xl border-l border-zinc-600 " + (data?.viewport === "Mobile" ? " hidden " : "") + data?.theme?.primary}>
        <Header />
        <Comments />
        <Interactions />
        <CommentBox />
      </div>
    );
  };

  const PostView = () => {
    return (
      <div className={"grid transform place-items-center " + (data?.viewport === "Mobile" ? " h-fit max-h-[700px] w-[90%] sm:w-full " : " h-[700px] rounded-l-2xl ") + data?.theme?.primary}>
        <div className={"flex h-fit max-h-screen w-fit max-w-[300px] items-center justify-center transition-all duration-300"}>
          <BiChevronLeft onClick={() => imageIndex > 0 && setImageIndex(imageIndex - 1)} className={"fixed left-4 top-[50%] h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex > 0 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <BiChevronRight onClick={() => imageIndex < (post.data?.imageURLs.length || 0) - 1 && setImageIndex(imageIndex + 1)} className={"fixed top-[50%] right-4 h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex < (post.data?.imageURLs.length || 0) - 1 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <Image src={post.data?.imageURLs[imageIndex] || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/image-placeholder.png"} key="image" className="h-full w-full object-cover" height={1000} width={1000} alt={"images"} />
        </div>
      </div>
    );
  };

  const SignInNotification = () => {
    if (!session) return <UnAuthedAlert />;

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
          <div className={"flex h-fit min-h-screen select-none items-center justify-center " + data?.theme?.secondary + (data?.viewport == "Web" && session && " pl-72 ") + (data?.viewport == "Tab" && session && " pl-16 ")}>
            <div className={"flex h-fit w-[90%] items-center justify-center sm:h-fit sm:w-fit " + (data?.viewport == "Mobile" && session && " flex-col ") + (showComments && " my-24 ")}>
              {deleteMenu && <OptionMenu buttonPositive="Delete" buttonNegative="Cancel" buttonLoading={deletePost.isLoading} description="Do you want to delete this post?" title="Delete post?" onClickPositive={() => deletePost.mutate({ userid: post.data?.user.id || "", postid: post.data?.id || "", index: post.data?.index || 0 })} onClickNegative={() => setDeleteMenu(false)} />}
              {deleteCommentMenu && <OptionMenu buttonPositive="Delete" buttonNegative="Cancel" buttonLoading={deleteComment.isLoading} description="Do you want to delete this post?" title="Delete post?" onClickPositive={() => deletePost.mutate({ userid: post.data?.user.id || "", postid: post.data?.id || "", index: post.data?.index || 0 })} onClickNegative={() => setDeleteMenu(false)} />}
              {likesMenu && <ListOfUsers users={post.data?.likes} onClickNegative={() => setLikesMenu(false)} title="Likes" />}
              <MobileHeader />
              <PostView />
              <WebSideView />
              <MobileFooter />
            </div>
          </div>
        </main>
      </>
    );
  }

  return <Spinner />;
};

export default Post;
