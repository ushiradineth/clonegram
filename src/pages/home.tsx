import { useSession } from "next-auth/react";
import router from "next/router";
import React from "react";
import themeObject from "../components/Theme";

interface itemType {
  viewport: string;
  supabase: unknown;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
}

const Home = (props: itemType) => {
  const { data: session, status } = useSession();


  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <div className={"select-none " + (props.viewport == "Web" && " ml-72 ") + (props.viewport == "Tab" && " ml-16 ")}>
          <div id="Background" className={"flex min-h-screen flex-col items-center justify-center " + props.theme.secondary}>
      <div className="flex h-96  w-96 items-center justify-center bg-black text-white">Home</div>
    </div></div>
  );
};

export default Home;
