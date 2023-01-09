import { AiOutlineClose } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { DataContext } from "../pages/_app";
import ProfileLink from "./ProfileLink";
import Spinner from "./Spinner";

type user = {
  UserID: string;
  UserName: string;
  UserHandle: string;
  UserImage: string;
  UserFollowing: boolean;
  UserRemoved: boolean;
};

interface itemType {
  users: user[];
  title: string;
  userHandle: string | undefined;
  userID: string | undefined;
  pageID: string;
  userSetter: (...arg: any) => unknown;
  onClickNegative: (...arg: any) => unknown;
}

const ListOfUsers = (props: itemType) => {
  const router = useRouter();
  const data = useContext(DataContext);
  const follow = trpc.user.follow.useMutation();
  const unfollow = trpc.user.unfollow.useMutation();

  const followFunc = (page: user) => {
    if (props.userID && page.UserID) {
      follow.mutate({ userid: props.userID, pageid: page.UserID });
      page.UserFollowing = true;
      props.userSetter(props.users);
    }
  };

  const unfollowFunc = (page: user) => {
    if (props.userID && page.UserID) {
      unfollow.mutate({ userid: props.userID, pageid: page.UserID });
      page.UserFollowing = false;
    }
  };

  const removeFunc = (page: user) => {
    if (props.userID && page.UserID) {
      unfollow.mutate({ userid: page.UserID, pageid: props.userID });
      page.UserRemoved = true;
    }
  };

  return (
    <div className="fixed top-0 left-0 z-20 h-screen w-screen select-none bg-black bg-opacity-30" onClick={() => props.onClickNegative}>
      <div className={"absolute top-1/2 left-1/2 z-20 w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.7)] " + data?.theme?.tertiary}>
        <>
          <div className="grid w-full grid-flow-row place-items-center border-b-2 border-zinc-700 py-4 font-semibold">
            <p className="select-none text-xl">{props.title}</p>
            <AiOutlineClose onClick={props.onClickNegative} className="fixed top-6 right-6 scale-150 hover:cursor-pointer" />
          </div>
          {props.users.length > 0 ? (
            props.users.map((user, index) => {
              const [text, setText] = useState("");

              useEffect(() => {
                !user.UserRemoved && (user.UserHandle !== props.userHandle ? (props.title === "Followers" && props.userID === props.pageID ? setText("Remove") : user.UserFollowing ? setText("Following") : setText("Follow")) : setText("Profile"));
              });

              useEffect(() => {
                !user.UserRemoved && (user.UserHandle !== props.userHandle ? (props.title === "Followers" && props.userID === props.pageID ? setText("Remove") : user.UserFollowing ? setText("Following") : setText("Follow")) : setText("Profile"));
              }, [user]);

              return (
                <ProfileLink
                  user={{ userHandle: user.UserHandle, userID: user.UserID, userImage: user.UserImage, userName: user.UserName }}
                  index={index}
                  key={index}
                  onClickHandler={() => router.push({ pathname: "/" + user.UserHandle })}
                  action={
                    <button id={user.UserHandle} disabled={user.UserRemoved} className={"cursor-pointer text-xs font-semibold disabled:cursor-not-allowed " + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => !user.UserRemoved && (user.UserHandle !== props.userHandle ? (props.title === "Followers" && props.userID === props.pageID ? removeFunc(user) : user.UserFollowing ? unfollowFunc(user) : followFunc(user)) : router.push({ pathname: "/" + user.UserHandle }))}>
                      {follow.isLoading || unfollow.isLoading ? <Spinner SpinnerOnly={true} /> : user.UserRemoved ? "Removed" : text}
                    </button>
                  }
                />
              );
            })
          ) : (
            <div className={"flex flex-col items-center justify-center rounded-2xl p-8 " + data?.theme?.tertiary}>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                  <BiUserPlus className="scale-x-[-6] scale-y-[6] transform" />
                </div>
                <div className="text-xl">{props.title}</div>
                <div className="text-sm">{props.title === "Followers" ? "You'll see all of the people who follow you here." : "When you follow people, you'll see them here."}</div>
              </div>
            </div>
          )}
          <div className="mt-6 grid w-full grid-flow-row place-items-center border-t-2 border-zinc-700 py-4 font-semibold"></div>
        </>
      </div>
    </div>
  );
};

export default ListOfUsers;
