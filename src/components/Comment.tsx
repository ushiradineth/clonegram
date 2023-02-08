import { type User, type Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import moment from "moment";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Comment = (props: { setDeleteCommentID(id: string): unknown; setDeleteCommentMenu(arg0: boolean): unknown; setLikeUsers(likes: User[]): unknown; setLikesMenu(arg0: boolean): unknown; comment: Comment & { user: User } & { likes: User[] }; post: any }) => {
  const router = useRouter();
  const data = useContext(DataContext);

  const likeComment = trpc.post.likecomment.useMutation({
    onSuccess: () => {
      props.post.refetch();
    },
  });

  const unlikeComment = trpc.post.unlikecomment.useMutation({
    onSuccess: () => {
      props.post.refetch();
    },
  });

  return (
    <div className="flex flex-col justify-center gap-2 p-4" key={props.comment.user.handle + props.comment.text}>
      <div className="flex items-center gap-2">
        <Link passHref href={"/profile/" + props.comment.user.handle} onClick={(e) => e.preventDefault()}>
          <Image className={"h-fit w-8 cursor-pointer rounded-full"} onClick={() => router.push("/profile/" + props.comment.user.handle)} src={props.comment.user.image || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/image-placeholder.png"} height={160} width={160} alt="Profile Picture" priority />
        </Link>
        <Link passHref href={"/profile/" + props.comment.user.handle} onClick={(e) => e.preventDefault()} className="max-w-56 flex h-fit w-fit gap-1 truncate font-semibold">
          <p className="truncate">{props.comment.user.name}</p>
          <p className="mt-[2px] truncate text-sm text-zinc-500">{"@" + props.comment.user.handle}</p>
        </Link>
        <p className="font-mono text-xs uppercase text-zinc-500">{moment(props.comment.createdAt).fromNow(true)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="break-all">{props.comment.text}</p>
        <div className="flex w-fit grid-flow-col items-center gap-2 font-mono text-xs text-zinc-500">
          <p className="flex items-center gap-1">
            {likeComment.isLoading || unlikeComment.isLoading || props.post.isFetching ? <Spinner SpinnerOnly={true} size={4} /> : props.comment.likes.find((e: { id: string }) => e.id === data?.user?.data.id) ? <AiFillHeart className="cursor-pointer text-xl text-red-500" onClick={() => unlikeComment.mutate({ userid: data?.user?.data.id || "", commentid: props.comment.id })} /> : <AiOutlineHeart className="cursor-pointer text-xl" onClick={() => likeComment.mutate({ userid: data?.user?.data.id || "", commentid: props.comment.id, commentOwnerid: props.comment.user.id, postid: props.post.data?.id || "" })} />}
            <button
              onClick={() => {
                props.setLikeUsers(props.comment.likes);
                props.setLikesMenu(true);
              }}
            >
              {props.comment.likes.length}
            </button>
          </p>
          {props.comment.user.handle === data?.user?.data.handle && (
            <MdOutlineDeleteOutline
              className="ml-2 cursor-pointer text-xl z-10"
              onClick={() => {
                props.setDeleteCommentID(props.comment.id);
                props.setDeleteCommentMenu(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
