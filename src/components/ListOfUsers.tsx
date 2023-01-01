import { AiOutlineClose } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

interface itemType {
  viewport: string;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  users: {
    UserID: string;
    UserName: string;
    UserHandle: string;
    UserImage: string;
    UserFollowing: boolean;
  }[];
  title: string;
  userHandle: string | undefined;
  userID: string | undefined;
  pageID: string;
  onClickNegative: (...arg: any) => unknown;
}

const ListOfUsers = (props: itemType) => {
  const router = useRouter();
  const follow = trpc.user.follow.useMutation({});
  const unfollow = trpc.user.unfollow.useMutation({});
  const remove = trpc.user.removeFollower.useMutation({});

  const followFunc = (pageID: any) => {
    if (props.userID && pageID) {
      follow.mutate({ userid: props.userID, pageid: pageID });
    }
  };

  const unfollowFunc = (pageID: any) => {
    if (props.userID && pageID) {
      unfollow.mutate({ userid: props.userID, pageid: pageID });
    }
  };

  const removeFunc = (pageID: any) => {
    if (props.userID && pageID) {
      remove.mutate({ userid: props.userID, pageid: pageID });
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 h-screen w-screen select-none bg-black bg-opacity-30" onClick={() => props.onClickNegative}>
      <div className={"absolute top-1/2 left-1/2 z-20 w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.7)] " + props.theme.tertiary}>
        <>
          <div className="grid w-full grid-flow-row place-items-center border-b-2 border-gray-300 py-4 font-semibold">
            <p className="select-none text-xl">{props.title}</p>
            <AiOutlineClose onClick={props.onClickNegative} className="fixed top-6 right-6 scale-150 hover:cursor-pointer" />
          </div>
          {props.users.length > 0 ? (
            props.users.map((user, index) => {
              return (
                <div key={index} className={"flex h-12 w-full items-center justify-center p-10 " + (index !== props.users.length - 1 && " border-b ")}>
                  <Image className={"w-12 cursor-pointer rounded-full"} onClick={() => router.push({ pathname: "/" + user.UserHandle })} src={user.UserImage} height={props.viewport == "Mobile" ? 96 : 160} width={props.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
                  <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={() => router.push({ pathname: "/" + user.UserHandle })}>
                    <div>{user.UserHandle}</div>
                    <div>{user.UserName}</div>
                  </div>
                  <div id="cta" className="cursor-pointer rounded-[4px] border py-1 px-2 text-xs font-semibold" onClick={() => (user.UserHandle !== props.userHandle ? (props.title === "Followers" && props.userID === props.pageID ? removeFunc(user.UserID) : user.UserFollowing ? unfollowFunc(user.UserID) : followFunc(user.UserID)) : router.push({ pathname: "/" + user.UserHandle }))}>
                    {user.UserHandle !== props.userHandle ? (props.title === "Followers" && props.userID === props.pageID ? "Remove" : user.UserFollowing ? "Following" : "Follow") : "Profile"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={"flex flex-col items-center justify-center rounded-2xl p-8 " + props.theme.tertiary}>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                  <BiUserPlus className="scale-x-[-6] scale-y-[6] transform" />
                </div>
                <div className="text-xl">{props.title}</div>
                <div className="text-sm">{props.title === "Followers" ? "You'll see all of the people who follow you here." : "When you follow people, you'll see them here."}</div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default ListOfUsers;
