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
  search: boolean;
  setSearch: (params: any) => any;
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
  lsTheme: string;
  setlsTheme: (params: any) => any;
}

const Layout = (props: itemType) => {
  const router = useRouter();
  const { data: session, status } = useSession(); 

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <></>;

  const switchLayout = () => {
    props.setlsTheme(props.theme.type === "dark" ? "light" : "dark");
    props.setTheme({ type: props.lsTheme, primary: props.theme.primary, secondary: props.theme.secondary, tertiary: props.theme.tertiary, accent: props.theme.accent });
  };

  const signout = () => {
    signOut({ callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL })
    localStorage.removeItem("clonegram.recentSearch")
  }

  if (status === "authenticated") {
    return (
      <>
        <div className="max-h-screen w-fit select-none">
          {props.create && <Create create={props.create} setCreate={props.setCreate} supabase={props.supabase} theme={props.theme} />}
          {props.search && <Search search={props.search} setSearch={props.setSearch} theme={props.theme} viewport={props.viewport} />}
          <div id="Sidebar" className={"fixed left-0 grid gap-4 " + props.theme.primary + (props.viewport == "Web" && " bottom-0 z-10 h-full w-72 grid-flow-row border-r transition-all duration-200 ") + (props.viewport == "Tab" && " top-0 h-full w-16 grid-flow-row border-r transition-all duration-200 ") + (props.viewport == "Mobile" && " bottom-0 h-12 w-screen grid-flow-col border-t ")}>
            <div id="Sidebar-Items" className={"text-2xl font-light transition-all duration-200 " + (props.viewport == "Web" && " ml-2 mt-5 ") + (props.viewport == "Tab" && " ml-1 mt-5 ")}>
              <div className={"ml-5 text-red-300 " + (props.viewport == "Mobile" ? " hidden " : " grid ")}>{props.viewport == "Web" ? "CLONEGRAM" : "C"}</div>
              <div id="Sidebar-Web-View-Items" className={"mt-5 ml-2 grid-flow-row place-items-start gap-5 " + (props.viewport == "Mobile" ? " hidden " : " grid ")}>
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} Text={"Home"} ID={"Home"} viewport={props.viewport} onClickHandler={() => router.push("/home")} active={Boolean(router.pathname == "/home")} theme={props.theme} />
                <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} ID={"Search"} viewport={props.viewport} theme={props.theme} onClickHandler={() => props.setSearch(!props.search)} active={props.search} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} ID={"Explore"} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} ID={"Messages"} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} ID={"Create"} viewport={props.viewport} theme={props.theme} onClickHandler={() => props.setCreate(!props.create)} active={props.create} />
                <NavBarItem Icon={session.user?.image} Text={"Profile"} ID={"Profile"} viewport={props.viewport} onClickHandler={() => router.push({ pathname: "/" + session?.user?.handle })} theme={props.theme} active={Boolean(router.pathname === "/[profile]")} />
              </div>
              <div id="Sidebar-Mobile-View-Items" className={"mt-[4px] grid grid-flow-col place-items-center " + (props.viewport != "Mobile" && " hidden ")}>
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} ID={"M-Home"} viewport={props.viewport} onClickHandler={() => router.push("/home")} theme={props.theme} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} ID={"M-Explore"} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} ID={"M-Create"} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} ID={"M-Messages"} viewport={props.viewport} theme={props.theme} />
                <NavBarItem Icon={session.user?.image} ID={"M-Profile"} viewport={props.viewport} onClickHandler={() => router.push({ pathname: "/" + session?.user?.handle, query: { user: "true" } })} theme={props.theme} />
              </div>
              <div id="Sidebar-More" className={"fixed bottom-5 left-2 z-0 " + (props.viewport == "Mobile" && " hidden ")}>
                <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} ID={"More"} viewport={props.viewport} theme={props.theme} onClickHandler={() => props.setMore(!props.more)} active={props.more} />
                {props.more && (
                  <div id="Sidebar-More-Items" className={"fixed bottom-16 left-6 z-10 w-fit rounded-lg py-1 text-sm " + (props.theme.type === "dark" ? " shadow-[0px_0px_10px_rgba(255,255,255,0.2)] " : " shadow-[0px_0px_10px_rgba(0,0,0,0.2)] ") + props.theme.secondary}>
                    <MoreItem Icon={<IoMdSettings />} Text="Settings" theme={props.theme} />
                    <MoreItem Icon={<RxBookmark />} Text="Saved" theme={props.theme} />
                    <MoreItem Icon={<RxTimer />} Text="Your Activity" theme={props.theme} />
                    <MoreItem Icon={<HiOutlineMoon />} Text="Switch Appearence" theme={props.theme} onClickHandler={switchLayout} />
                    <MoreItem Icon={<BiMessageAltError />} Text="Report a problem" theme={props.theme} />
                    <MoreItem Icon={<AiOutlineUserSwitch />} Text="Switch accounts" theme={props.theme} />
                    <MoreItem Icon={<MdLogout />} Text="Log out" onClickHandler={signout} theme={props.theme} last={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (status === "loading") {
    return <Spinner theme={props.theme} />;
  }

  return <></>;
};

export default Layout;
