import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SettingsItem from "../components/SettingsItem";
import Spinner from "../components/Spinner";
import EditProfile from "../components/EditProfile";
import BlockedUsers from "../components/BlockedUsers";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import Head from "next/head";
import Account from "../components/Account";

const Settings = () => {
  const { status } = useSession();
  const data = useContext(DataContext);
  const router = useRouter();
  const [active, setActive] = useState("Edit Profile");
  const [hook, setHook] = useState(<EditProfile />);

  useEffect(() => {
    switch (active) {
      case "Edit Profile":
        setHook(<EditProfile />);
        break;
      case "Blocked users":
        setHook(<BlockedUsers />);
        break;
      case "Account":
        setHook(<Account />);
        break;
      default:
        setHook(<></>);
    }
  }, [active]);

  if (status === "unauthenticated") router.push("/");
  if (status === "loading") return <Spinner />;

  return (
    <>
      <Head>
        <title>Settings • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"h-screen select-none " + (data?.viewport == "Web" && " ml-72 ") + (data?.viewport == "Tab" && " ml-16 ")}>
        <div id="Background" className={"flex min-h-screen items-center justify-center " + data?.theme?.secondary}>
          <div id="Setting" className="flex h-[400px] w-fit items-center justify-center">
            <div id="Sidebar" className={"bottom-0 z-10 grid h-full w-fit grid-flow-row gap-4 border border-gray-400 " + data?.theme?.primary}>
              <div id="Sidebar-Items" className={"text-2xl font-light " + (data?.viewport === "Mobile" ? " mr-2 w-fit max-w-[110px] " : " w-[150px] ")}>
                <SettingsItem Text={"Edit Profile"} ID={"Edit Profile"} setActive={setActive} active={active} />
                <SettingsItem Text={"Blocked users"} ID={"Blocked users"} setActive={setActive} active={active} />
                <SettingsItem Text={"Account"} ID={"Account"} setActive={setActive} active={active} />
              </div>
            </div>
            <div className={"flex h-full items-center justify-center border border-gray-400 " + (data?.viewport === "Mobile" ? " w-[350px] " : " w-[500px] ") + data?.theme?.tertiary}>{hook}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Settings;
