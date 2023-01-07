import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SettingsItem from "../components/SettingsItem";
import Spinner from "../components/Spinner";
import EditProfile from "../components/EditProfile";
import BlockedUsers from "../components/BlockedUsers";
import { UserType } from "../types/types";

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
  user: UserType;
}

const Profile = (props: itemType) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("Edit Profile");
  const [hook, setHook] = useState(<EditProfile viewport={props.viewport} supabase={props.supabase} theme={props.theme} user={props.user} />);

  useEffect(() => {    
    switch (active) {
      case "Edit Profile":
        setHook(<EditProfile viewport={props.viewport} supabase={props.supabase} theme={props.theme} user={props.user} />);
        break;
      case "Blocked users":
        setHook(<BlockedUsers viewport={props.viewport} supabase={props.supabase} theme={props.theme} user={props.user} />);
        break;
      default:
        setHook(<></>);
    }
  }, [active]);

  if (status === "unauthenticated") router.push("/");
  if (status === "loading") return <Spinner viewport={props.viewport} theme={props.theme} />;

  return (
    <>
      <div className={"h-screen select-none " + (props.viewport == "Web" && " ml-72 ") + (props.viewport == "Tab" && " ml-16 ")}>
        <div id="Background" className={"flex min-h-screen items-center justify-center " + props.theme.secondary}>
          <div id="Setting" className="flex h-[600px] w-fit items-center justify-center">
            <div id="Sidebar" className={"bottom-0 z-10 grid h-full w-72 grid-flow-row gap-4 border border-gray-400 " + props.theme.primary}>
              <div id="Sidebar-Items" className="text-2xl font-light">
                <SettingsItem Text={"Edit Profile"} ID={"Edit Profile"} setActive={setActive} active={active} theme={props.theme} />
                <SettingsItem Text={"Blocked users"} ID={"Blocked users"} setActive={setActive} active={active} theme={props.theme} />
              </div>
            </div>
            <div className={"flex h-full w-[500px] items-center justify-center border border-gray-400 " + props.theme.primary}>{hook}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
