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
import MobileSearch from "./MobileSearch";
import { DataContext } from "../pages/_app";
import { useContext } from "react";

interface itemType {
  create: boolean;
  setCreate: (params: any) => any;
  search: boolean;
  setSearch: (params: any) => any;
  more: boolean;
  setMore: (params: any) => any;
  setTheme: (params: any) => any;
  lsTheme: string;
  setlsTheme: (params: any) => any;
  hideSideComponents: boolean;
  setHideSideComponents: (params: any) => any;
}

const Layout = (props: itemType) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const data = useContext(DataContext);

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <></>;

  const switchLayout = () => {
    props.setlsTheme(data?.theme?.type === "dark" ? "light" : "dark");
    props.setTheme({ type: props.lsTheme, primary: data?.theme?.primary, secondary: data?.theme?.secondary, tertiary: data?.theme?.tertiary, accent: data?.theme?.accent });
  };

  const signout = () => {
    signOut({ callbackUrl: env.NEXT_PUBLIC_NEXTAUTH_URL });
    localStorage.removeItem("clonegram.recentSearch");
  };

  const onClickHandler = (route: string) => {
    props.setHideSideComponents(true);
    router.push(route);
  };

  if (status === "authenticated") {
    return (
      <>
        <div className={"max-h-screen w-fit select-none " + data?.theme?.primary}>
          {props.create && <Create create={props.create} setCreate={props.setCreate} />}
          {props.search && <Search search={props.search} setSearch={props.setSearch} />}
          <div id="Sidebar" className={"fixed left-0 grid gap-4 " + (data?.viewport !== "Mobile" && data?.theme?.primary) + (data?.viewport == "Web" && " bottom-0 z-10 h-full w-72 grid-flow-row border-r transition-all duration-200 ") + (data?.viewport == "Tab" && " top-0 h-full w-16 grid-flow-row border-r transition-all duration-200 ") + (data?.viewport == "Mobile" && " top-0 h-screen w-screen grid-flow-col ") + (data?.theme?.type === "dark" ? " border-zinc-500 " : "  border-zinc-300 ")}>
            <div id="Sidebar-Items" className={"text-2xl font-light transition-all duration-200 " + (data?.viewport == "Web" && " ml-2 mt-5 ") + (data?.viewport == "Tab" && " ml-1 mt-5 ")}>
              <div onClick={() => onClickHandler("/home")} className={"cursor-pointer text-red-300 " + (data?.viewport == "Web" ? " ml-5 text-2xl " : " ml-4 text-4xl font-normal ") + (data?.viewport == "Mobile" ? " hidden " : " grid ")}>
                {data?.viewport == "Web" ? "CLONEGRAM" : "C"}
              </div>
              <div id="Sidebar-Web-View-Items" className={"mt-5 ml-2 grid-flow-row place-items-start gap-5 " + (data?.viewport == "Mobile" ? " hidden " : " grid ")}>
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} Text={"Home"} ID={"Home"} onClickHandler={() => onClickHandler("/home")} active={Boolean(router.pathname == "/home" && !props.create && !props.search && !props.more)} />
                <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} ID={"Search"} onClickHandler={() => props.setSearch(!props.search)} active={props.search} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} ID={"Explore"} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} ID={"Messages"} />
                <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} ID={"Create"} onClickHandler={() => props.setCreate(!props.create)} active={props.create} />
                <NavBarItem Icon={data?.user?.data.image} Text={"Profile"} ID={"Profile"} onClickHandler={() => onClickHandler("/" + data?.user?.data.handle)} active={Boolean(router.query.profile === data?.user?.data.handle && !props.create && !props.search && !props.more)} />
              </div>
              <div id="Header-Mobile-View-Items" className={"fixed top-0 grid h-16 w-screen grid-flow-col place-items-center border-b border-zinc-600 " + data?.theme?.primary + (data?.viewport != "Mobile" && " hidden ") + (router.pathname !== "/home" && " hidden ")}>
                <div className="cursor-pointer text-4xl font-normal text-red-300" onClick={() => onClickHandler("/home")}>
                  C
                </div>
                <MobileSearch />
                <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} />
              </div>
              <div id="Footer-Mobile-View-Items" className={"fixed bottom-0 mt-[4px] grid h-12 w-screen grid-flow-col place-items-center border-t border-zinc-600 " + data?.theme?.primary + (data?.viewport != "Mobile" && " hidden ")}>
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} ID={"M-Home"} onClickHandler={() => onClickHandler("/home")} active={Boolean(router.pathname == "/home" && !props.create && !props.search && !props.more)} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} ID={"M-Explore"} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} ID={"M-Create"} onClickHandler={() => props.setCreate(!props.create)} active={props.create} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} ID={"M-Messages"} />
                <NavBarItem Icon={data?.user?.data.image} ID={"M-Profile"} onClickHandler={() => onClickHandler("/" + data?.user?.data.handle)} active={Boolean(router.query.profile === data?.user?.data.handle && !props.create && !props.search && !props.more)} />
              </div>
              <div id="Sidebar-More" className={"fixed bottom-5 left-2 z-0 " + (data?.viewport == "Mobile" && " hidden ")}>
                <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} ID={"More"} onClickHandler={() => props.setMore(!props.more)} active={props.more} />
                {props.more && (
                  <div id="Sidebar-More-Items" className={"fixed bottom-16 left-6 z-10 w-fit rounded-lg py-1 text-sm " + (data?.theme?.type === "dark" ? " shadow-[0px_0px_10px_rgba(255,255,255,0.2)] " : " shadow-[0px_0px_10px_rgba(0,0,0,0.2)] ") + data?.theme?.secondary}>
                    <MoreItem Icon={<IoMdSettings />} Text="Settings" setMore={props.setMore} onClickHandler={() => router.push("/settings")} />
                    <MoreItem Icon={<RxBookmark />} Text="Saved" setMore={props.setMore} onClickHandler={() => {}} />
                    <MoreItem Icon={<RxTimer />} Text="Your Activity" setMore={props.setMore} onClickHandler={() => {}} />
                    <MoreItem Icon={<HiOutlineMoon />} Text="Switch Appearence" setMore={props.setMore} onClickHandler={switchLayout} />
                    <MoreItem Icon={<BiMessageAltError />} Text="Report a problem" setMore={props.setMore} onClickHandler={() => {}} />
                    <MoreItem Icon={<AiOutlineUserSwitch />} Text="Switch accounts" setMore={props.setMore} onClickHandler={() => {}} />
                    <MoreItem Icon={<MdLogout />} Text="Log out" setMore={props.setMore} last={true} onClickHandler={signout} />
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
    return <Spinner />;
  }

  return <></>;
};

export default Layout;
