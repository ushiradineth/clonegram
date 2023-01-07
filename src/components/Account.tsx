import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { UserType } from "../types/types";
import { BiUserX } from "react-icons/bi";
import OptionMenu from "./OptionMenu";

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

const Account = (props: itemType) => {
  const [deleteMenu, setDeleteMenu] = useState(false);

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: () => signOut(),
  });

  const deleteUserFunc = () => {
    deleteUser.mutate({ id: props.user.data.id });
    setDeleteMenu(false);
  };

  return (
    <>
      {deleteMenu && <OptionMenu title="Delete your account?" description="If you delete your account, your data won't be recoverable" buttonPositive="Delete" buttonNegative="Cancel" onClickPositive={() => deleteUserFunc()} onClickNegative={() => setDeleteMenu(false)} theme={props.theme} />}
      <div className="flex flex-col items-center justify-center rounded-2xl">
        <div className="flex w-44 flex-col items-center justify-center p-4">
          <button id="Log out" className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-400 px-4 py-2" onClick={() => signOut()}>
            Log out
          </button>
          <button id=" Delete Account" className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-red-400 px-4 py-2" onClick={() => setDeleteMenu(true)}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;
