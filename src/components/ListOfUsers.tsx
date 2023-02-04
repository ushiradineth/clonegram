import { AiOutlineClose } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import ProfileLink from "./ProfileLink";
import { User } from "@prisma/client";
import { DataContext } from "../pages/_app";

interface itemType {
  users: User[] | undefined;
  title: string;
  onClickNegative: (...arg: any) => unknown;
}

const ListOfUsers = (props: itemType) => {
  const router = useRouter();
  const data = useContext(DataContext);
  
  return (
    <div className={"fixed top-0 left-0 z-20 h-screen w-screen select-none bg-opacity-30 " + data?.theme?.secondary} onClick={() => props.onClickNegative}>
      <div className={"absolute top-1/2 left-1/2 z-20 grid w-[400px] -translate-x-1/2 -translate-y-1/2 transform place-items-center rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.7)] " + data?.theme?.secondary}>
        <>
          <div className="grid w-full grid-flow-row place-items-center border-b-2 border-zinc-700 py-4 font-semibold">
            <p className="select-none text-xl">{props.title}</p>
            <AiOutlineClose onClick={props.onClickNegative} className="fixed top-6 right-6 scale-150 hover:cursor-pointer" />
          </div>
          {(props.users?.length || 0) > 0 ? (
            props.users?.map((user: User, index: number) => {
              return <ProfileLink user={{ userHandle: user.handle, userID: user.id, userImage: user.image || "", userName: user.name || "" }} index={index} key={index} onClickHandler={() => router.push({ pathname: "/profile/" + user.handle })} />;
            })
          ) : (
            <div className={"flex flex-col items-center justify-center rounded-2xl"}>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                  <BiUserPlus className="scale-x-[-6] scale-y-[6] transform" />
                </div>
                <div className="text-xl">{props.title}</div>
                <div className="text-sm">{props.title === "Likes" && "When people like this post, you'll see them here."}</div>
              </div>
            </div>
          )}
          <div className="mt-6 grid w-full grid-flow-row place-items-center rounded-b-2xl border-t-2 border-zinc-700 py-4 font-semibold"></div>
        </>
      </div>
    </div>
  );
};

export default ListOfUsers;
