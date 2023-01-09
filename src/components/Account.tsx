import React, { useState, useContext } from "react";
import { signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import OptionMenu from "./OptionMenu";
import { DataContext } from "../pages/_app";
import Spinner from "./Spinner";

const Account = () => {
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [logout, setLogout] = useState(false);
  const data = useContext(DataContext);

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: () => signOut(),
  });

  const deleteUserFunc = () => {
    if (data?.user?.data.id) {
      deleteUser.mutate({ id: data?.user?.data.id });
      setDeleteMenu(false);
    }
  };

  const onLogout = () => {
    setLogout(true);
    signOut();
  };

  return (
    <div className="z-50">
      {deleteMenu && <OptionMenu title="Delete your account?" description="If you delete your account, your data won't be recoverable" buttonPositive="Delete" buttonNegative="Cancel" onClickPositive={() => deleteUserFunc()} onClickNegative={() => setDeleteMenu(false)} />}
      <div className="flex flex-col items-center justify-center rounded-2xl">
        <div className="flex w-44 flex-col items-center justify-center p-4 font-semibold">
          <button id="Log out" className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-4 py-2" onClick={onLogout}>
            {logout ? <Spinner SpinnerOnly={true} fill={"fill-blue-300"} /> : "Log out"}
          </button>
          <button id="Delete Account" className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-red-600 px-4 py-2" onClick={() => setDeleteMenu(true)}>
            {deleteUser.isLoading ? <Spinner SpinnerOnly={true} /> : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
