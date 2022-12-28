import { AiOutlineHome, AiFillHome, AiOutlineHeart, AiFillHeart, AiOutlineUserSwitch } from "react-icons/ai";
import { MdOutlineExplore, MdExplore, MdLogout } from "react-icons/md";
import { BiSearchAlt2, BiMessageAltError } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { HiMenu, HiOutlineMenu, HiOutlineMoon } from "react-icons/hi";
import { RxBookmark, RxTimer } from "react-icons/rx";
import { RiMessage3Line, RiMessage3Fill, RiAddBoxLine, RiAddBoxFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NavBarItem from "./NavBarItem";
import MoreItem from "./MoreItem";
import Create from "./Create";
import Search from "./Search";
import Spinner from "./Spinner";
import { env } from "../env/client.mjs";

interface itemType {
  create: boolean;
  setCreate: (params: any) => any;
  viewport: string;
  active: string;
  setActive: (params: any) => any;
  search: boolean;
  more: boolean;
  setMore: (params: any) => any;
  supabase: unknown;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  setTheme: (params: any) => any;
}

const Layout = (props: itemType) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <></>;

  if (status === "authenticated") {
    return (
      <>
        <div className="max-h-screen w-fit select-none">
          {/* <Create create={props.create} setCreate={props.setCreate} setActive={props.setActive} supabase={props.supabase} /> */}
          {/* <Search search={props.search} viewport={props.viewport} /> */}
          <div id="Sidebar" className={"fixed left-0 grid gap-4 border-r-2 " + props.theme.primary + (props.viewport == "Web" && " bottom-0 z-10 h-full w-72 grid-flow-row transition-all duration-200 ") + (props.viewport == "Tab" && " top-0 h-full w-16 grid-flow-row transition-all duration-200 ") + (props.viewport == "Mobile" && " bottom-0 h-12 w-screen grid-flow-col ") + (props.create && " opacity-30 ")}>
            <div id="Sidebar-Items" className={"text-2xl font-light transition-all duration-200 " + (props.viewport == "Web" && " ml-2 mt-5 ") + (props.viewport == "Tab" && " ml-1 mt-5 ")}>
              <p className={"ml-5 " + (props.viewport == "Mobile" ? " hidden " : " grid ")}>{props.viewport == "Web" ? "CLONEGRAM" : "C"}</p>
              <div id="Sidebar-Web-View-Items" className={"mt-5 ml-2 grid-flow-row place-items-start gap-5 " + (props.viewport == "Mobile" ? " hidden " : " grid ")}>
                <NavBarItem
                  Icon={<AiOutlineHome />}
                  IconOnClick={<AiFillHome />}
                  Text={"Home"}
                  ID={"Home"}
                  active={props.active}
                  setActive={props.setActive}
                  viewport={props.viewport}
                  onClickHandler={() => {
                    router.push("/home");
                  }}
                  theme={props.theme}
                />
                <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} ID={"Search"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} ID={"Explore"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} ID={"Messages"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} ID={"Create"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem
                  Icon={session.user?.image}
                  Text={"Profile"}
                  ID={"Profile"}
                  active={props.active}
                  setActive={props.setActive}
                  viewport={props.viewport}
                  onClickHandler={() => {
                    router.push("/" + session?.user?.handle);
                  }}
                  theme={props.theme}
                />
              </div>
              <div id="Sidebar-Mobile-View-Items" className={"mt-[4px] grid grid-flow-col place-items-center " + (props.viewport != "Mobile" && " hidden ")}>
                <NavBarItem
                  Icon={<AiOutlineHome />}
                  IconOnClick={<AiFillHome />}
                  ID={"M-Home"}
                  active={props.active}
                  setActive={props.setActive}
                  viewport={props.viewport}
                  onClickHandler={() => {
                    router.push("/home");
                  }}
                  theme={props.theme}
                />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} ID={"M-Explore"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} ID={"M-Create"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} ID={"M-Messages"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                <NavBarItem
                  Icon={session.user?.image}
                  ID={"M-Profile"}
                  active={props.active}
                  setActive={props.setActive}
                  viewport={props.viewport}
                  onClickHandler={() => {
                    router.push("/" + session?.user?.handle);
                  }}
                  theme={props.theme}
                />
              </div>
              <div id="Sidebar-More" className={"fixed bottom-5 " + (props.viewport == "Mobile" && " hidden ")}>
                <div className={"ml-2"} onClick={() => props.setMore(!props.more)}>
                  <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} ID={"More"} active={props.active} setActive={props.setActive} viewport={props.viewport} theme={props.theme} />
                </div>
                {props.more ? (
                  <div id="Sidebar-More-Items" className={"fixed bottom-16 left-4 z-10 w-fit rounded-lg py-1 text-sm " + (props.theme.type === "dark" ? " shadow-[0px_0px_10px_rgba(255,255,255,0.2)] " : " shadow-[0px_0px_10px_rgba(0,0,0,0.2)] ") + props.theme.secondary}>
                    <MoreItem Icon={<IoMdSettings />} Text="Settings" theme={props.theme} />
                    <MoreItem Icon={<RxBookmark />} Text="Saved" theme={props.theme} />
                    <MoreItem Icon={<RxTimer />} Text="Your Activity" theme={props.theme} />
                    <MoreItem
                      Icon={<HiOutlineMoon />}
                      Text="Switch Appearence"
                      theme={props.theme}
                      onClickHandler={() => {
                        localStorage.setItem("theme", props.theme.type === "dark" ? "light" : "dark");
                        props.setTheme({ type: localStorage.getItem("theme"), primary: props.theme.primary, secondary: props.theme.secondary, tertiary: props.theme.tertiary, accent: props.theme.accent });
                      }}
                    />
                    <MoreItem Icon={<BiMessageAltError />} Text="Report a problem" theme={props.theme} />
                    <MoreItem Icon={<AiOutlineUserSwitch />} Text="Switch accounts" theme={props.theme} />
                    <MoreItem Icon={<MdLogout />} Text="Log out" onClickHandler={() => signOut({ callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })} theme={props.theme} last={true} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  // color={theme.type === "dark" ? "white" : "black"}
  if (status === "loading") {
    return <Spinner />;
  }

  return <></>;
};

export default Layout;
