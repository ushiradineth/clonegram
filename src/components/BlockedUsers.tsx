import React, { useState, useContext } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { BiUserX } from "react-icons/bi";
import { DataContext } from "../pages/_app";

const BlockedUsers = () => {
  const [blocking, setBlocking] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();
  const data = useContext(DataContext);

  const block = trpc.user.block.useMutation({
    onSuccess: () => data?.user?.refetch(),
  });

  const unblock = trpc.user.unblock.useMutation({
    onSuccess: () => data?.user?.refetch(),
  });

  const blockFunc = (page: any, setBlocking: (arg0: any) => any) => {
    if (data?.user?.data.id && page.id) {
      block.mutate({ userid: data?.user?.data.id, pageid: page.id });
      setBlocking(true);
    }
  };

  const unblockFunc = (page: any, setBlocking: (arg0: any) => any) => {
    if (data?.user?.data.id && page.id) {
      unblock.mutate({ userid: data?.user?.data.id, pageid: page.id });
      setBlocking(false);
    }
  };

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner />;


  return (
    <div className="z-50">
      {data?.user?.data.blocking.length || 0 > 0 ? (
        data?.user?.data.blocking.map((user, index) => {

          return (
            <div key={index} className={"flex h-12 w-full items-center justify-center p-10 " + (index !== data?.user?.data.blocking.length || (0 - 1 && " border-b "))}>
              <Image className={"w-12 cursor-pointer rounded-full"} onClick={() => router.push({ pathname: "/" + user.handle })} src={user.image || "/image-placeholder.png"} height={data?.viewport == "Mobile" ? 96 : 160} width={data?.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
              <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={() => router.push({ pathname: "/" + user.handle })}>
                <div>{user.handle}</div>
                <div>{user.name}</div>
              </div>
              <button id={user.handle} disabled={block.isLoading || unblock.isLoading} className={"cursor-pointer text-xs font-semibold disabled:cursor-not-allowed" + (block.isLoading || unblock.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => (blocking ? unblockFunc(user, setBlocking) : blockFunc(user, setBlocking))}>
                {block.isLoading || unblock.isLoading ? (
                  <Spinner SpinnerOnly={true} />
                ) : blocking[index] ? (
                  "Unblock"
                ) : (
                  "Block"
                )}
              </button>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
              <BiUserX className="scale-x-[-6] scale-y-[6] transform" />
            </div>
            <div className="text-sm">You&lsquo;ll see all the people you have blocked</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedUsers;
