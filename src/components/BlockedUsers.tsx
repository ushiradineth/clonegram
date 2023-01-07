import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { UserType } from "../types/types";
import { BiUserX } from "react-icons/bi";

interface itemType {
  viewport: string;
  supabase: any;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  user: UserType;
}

const BlockedUsers = (props: itemType) => {
  const { data: session } = useSession();
  const router = useRouter();

  const block = trpc.user.block.useMutation({
    onSuccess: () => props.user.refetch(),
  });
  const unblock = trpc.user.unblock.useMutation({
    onSuccess: () => props.user.refetch(),
  });

  const blockFunc = (page: any, setBlocking: (arg0: any) => any) => {
    if (props.user.data.id && page.id) {
      block.mutate({ userid: props.user.data.id, pageid: page.id });
      setBlocking(true);
    }
  };

  const unblockFunc = (page: any, setBlocking: (arg0: any) => any) => {
    if (props.user.data.id && page.id) {
      unblock.mutate({ userid: props.user.data.id, pageid: page.id });
      setBlocking(false);
    }
  };

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner viewport={props.viewport} theme={props.theme} />;

  return (
    <div className="select-none">
      <div className="w-[350px] m-2 rounded-2xl">
        <>
          {props.user.data.blocking.length > 0 ? (
            props.user.data.blocking.map((user, index) => {
              const [blocking, setBlocking] = useState(true);

              useEffect(() => {}, [user]);

              return (
                <div key={index} className={"flex h-12 w-full items-center justify-center p-10 " + (index !== props.user.data.blocking.length - 1 && " border-b ")}>
                  <Image className={"w-12 cursor-pointer rounded-full"} onClick={() => router.push({ pathname: "/" + user.handle })} src={user.image || ""} height={props.viewport == "Mobile" ? 96 : 160} width={props.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
                  <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={() => router.push({ pathname: "/" + user.handle })}>
                    <div>{user.handle}</div>
                    <div>{user.name}</div>
                  </div>
                  <button id={user.handle} disabled={block.isLoading || unblock.isLoading} className={"cursor-pointer text-xs font-semibold disabled:cursor-not-allowed" + (block.isLoading || unblock.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => (blocking ? unblockFunc(user, setBlocking) : blockFunc(user, setBlocking))}>
                    {block.isLoading || unblock.isLoading ? (
                      <svg aria-hidden="true" className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                    ) : blocking ? (
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
                <div className="text-sm">You'll see all the people you have blocked</div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default BlockedUsers;
