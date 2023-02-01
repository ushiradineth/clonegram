import React, { useState, useEffect } from "react";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
import Spinner from "./Spinner";
import Error from "./Error";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Link from "next/link";
import { MdOutlineDeleteOutline } from "react-icons/md";
import OptionMenu from "./OptionMenu";
import ListOfUsers from "./ListOfUsers";
import UnAuthedAlert from "./UnAuthedAlert";
import moment from "moment";
import { TbMessageCircle2 } from "react-icons/tb";
import { IoPaperPlaneOutline } from "react-icons/io5";

const PostItem = (props: { postID?: string; post?: any }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [like, setLike] = useState<boolean | null>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [likesMenu, setLikesMenu] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const data = useContext(DataContext);

  const query = trpc.post.getPost.useQuery({ id: props.postID || "0" }, { retry: false, refetchOnWindowFocus: false, enabled: Boolean(props.postID) });
  const post = props.postID ? query : props.post;

  const likePost = trpc.post.likePost.useMutation({
    onMutate: () => {
      setLike(true);
    },
    onSuccess: (d) => {
      post?.data?.likes.push(d.q2);
    },
  });

  const unlikePost = trpc.post.unlikePost.useMutation({
    onMutate: () => {
      setLike(false);
    },
    onSuccess: (d) => {
      post.data?.likes.splice(
        post.data?.likes.findIndex((e: { id: string }) => e.id === d.q2.id),
        1
      );
    },
  });

  const deletePost = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      router.pathname === "/" ? location.reload() : router.push("/");
      data?.user?.refetch();
    },
  });

  useEffect(() => {
    post.isSuccess && setLike(Boolean(post?.data.likes.find((e: { id: string | undefined }) => e.id === data?.user?.data.id)));
  }, [post.isSuccess]);

  const ProfileView = () => {
    return (
      <div className={"mt-5 flex h-12 w-fit items-center justify-center px-4 "}>
        <Image className={"h-12 w-12 cursor-pointer rounded-full"} onClick={() => router.push("/profile/" + data?.user?.data.handle)} src={post.data?.user.image || ""} height={160} width={160} alt="Profile Picture" priority />
        <div className="m-4 flex w-full flex-col justify-center gap-1 truncate">
          <div className="flex gap-2">
            <Link passHref href={"/profile/" + post.data?.user.handle} className={"cursor-pointer " + post.data?.user.handle !== data?.user?.data.handle ? " overflow-hidden truncate " : ""}>
              {post.data?.user.handle}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const InteractionBar = () => {
    return (
      <>
        <div className="mb-2 grid grid-flow-col place-items-start">
          <div className={"mt-4 ml-3 grid h-fit w-fit scale-[1.6] grid-flow-col gap-2 child-hover:text-zinc-600 " + (post.data?.user.handle === data?.user?.data.handle ? " pl-5 " : " pl-4 ")}>
            {likePost.isLoading || unlikePost.isLoading || post.isFetching ? <Spinner SpinnerOnly={true} size={4} /> : like ? <AiFillHeart className="cursor-pointer text-red-500" onClick={() => unlikePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" })} /> : <AiOutlineHeart className="cursor-pointer" onClick={() => likePost.mutate({ userid: data?.user?.data.id || "", postOwnerid: post.data?.userId || "", postid: post.data?.id || "" })} />}
            <TbMessageCircle2 className={"cursor-pointer"} onClick={() => router.push("/post/" + post.data.id) } />
            <IoPaperPlaneOutline className="cursor-pointer" />
            {post.data?.user.handle === data?.user?.data.handle && <MdOutlineDeleteOutline className="cursor-pointer" onClick={() => setDeleteMenu(true)} />}
          </div>
        </div>
        <div className="pb-2">
          {(post.data?.likes.length || 0) > 0 && (
            <div className="mt-1 cursor-pointer pl-4 text-xs uppercase text-zinc-300" onClick={() => setLikesMenu(true)}>
              {(post.data?.likes.length || 0) > 0 && post.data?.likes.length + " " + ((post.data?.likes.length || 0) > 1 ? "likes" : "like")}
            </div>
          )}
          {post.data.caption ? <p className="mt-1 truncate pl-4 text-xs font-semibold text-zinc-300">{post.data?.caption}</p> : <></>}
          <p className="mt-1 pl-4 font-mono text-xs uppercase text-zinc-300">{moment(post.data.createdAt).fromNow()} </p>
        </div>
      </>
    );
  };

  const Header = () => {
    return (
      <div className={"z-10 flex h-fit w-full items-center justify-start rounded-t-2xl border-b border-zinc-600 bg-zinc-900 pl-4 pb-5 text-gray-300"}>
        <ProfileView />
      </div>
    );
  };

  const Footer = () => {
    return (
      <div className={"flex h-fit w-full flex-col items-center justify-start rounded-b-2xl border-t border-zinc-600 bg-zinc-900 text-gray-300"}>
        <div className="grid w-full border-zinc-600">
          <InteractionBar />
        </div>
      </div>
    );
  };

  const PostView = () => {
    return (
      <div className={"grid h-full w-full transform place-items-center bg-zinc-900 text-gray-300 transition-all duration-300"}>
        <div className="flex h-full max-h-[200px] w-full items-center justify-center transition-all duration-300 md:max-h-[475px]">
          <BiChevronLeft onClick={() => imageIndex > 0 && setImageIndex(imageIndex - 1)} className={"fixed left-4 top-[50%] h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex > 0 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <BiChevronRight onClick={() => imageIndex < (post.data?.imageURLs.length || 0) - 1 && setImageIndex(imageIndex + 1)} className={"fixed top-[50%] right-4 h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex < (post.data?.imageURLs.length || 0) - 1 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <Image onDoubleClick={() => (likePost.isLoading || unlikePost.isLoading || post.isFetching ? {} : like ? unlikePost.mutate({ userid: data?.user?.data.id || "", postid: post.data?.id || "" }) : likePost.mutate({ userid: data?.user?.data.id || "", postOwnerid: post.data?.userId || "", postid: post.data?.id || "" }))} src={post.data?.imageURLs[imageIndex] || "https://zjbjwmzfbmoykisvhhie.supabase.co/storage/v1/object/public/surgeapp/Assets/image-placeholder.png"} key="image" className="h-full w-full object-contain" height={1000} width={1000} alt={"images"} />
        </div>
      </div>
    );
  };

  if (post.isError && !post.data) return <Error error="Post not found" session={status === "authenticated"} />;
  if (post.isLoading) return <Spinner removeBackground={true} />;

  if (post.isSuccess && post.data) {
    return (
      <>
        {props.postID && (
          <Head>
            <title>{`${post?.data?.user.name} (@${post?.data?.user.handle})	• SurgeApp`}</title>
            <meta name="description" content="SurgeApp by Ushira Dineth" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        )}
        <main className="flex items-center justify-center">
          {status === "unauthenticated" && <UnAuthedAlert />}
          <div id="post" className={"flex h-[400px] w-screen select-none flex-col items-center justify-center rounded-2xl border-2 border-zinc-600 sm:w-[400px] md:h-[700px] md:w-[700px] " + (props.post ? " my-4 md:h-fit " : " h-screen ")}>
            {deleteMenu && <OptionMenu buttonPositive={deletePost.isLoading ? <Spinner SpinnerOnly={true} fill={"fill-red-500"} /> : "Delete"} buttonNegative="Cancel" description="Do you want to delete this post?" title="Delete post?" onClickPositive={() => deletePost.mutate({ userid: post.data.user.id, postid: post.data.id, index: post.data?.index })} onClickNegative={() => setDeleteMenu(false)} />}
            {likesMenu && <ListOfUsers pageID={post.data.userid} userHandle={data?.user?.data.handle} userID={data?.user?.data.id} users={post.data?.likes} onClickNegative={() => setLikesMenu(false)} title="Likes" />}
            <Header />
            <PostView />
            <Footer />
          </div>
        </main>
      </>
    );
  }

  return <Spinner />;
};

export default PostItem;
