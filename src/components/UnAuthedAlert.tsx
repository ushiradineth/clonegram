import { useRouter } from "next/router";
import React from "react";
import { DataContext } from "../pages/_app";
import { useContext } from "react";

const UnAuthedAlert = () => {
  const router = useRouter();
  const data = useContext(DataContext);
  return (
    <div className={"fixed bottom-0 left-0 flex h-12 w-screen items-center justify-center gap-2 " + data?.theme?.primary}>
      Sign in to Clonegram to see more!
      <button className={"rounded-full px-4 py-2 font-semibold no-underline transition " + data?.theme?.tertiary} onClick={() => router.push("/")}>
        Sign in
      </button>
    </div>
  );
};

export default UnAuthedAlert;
