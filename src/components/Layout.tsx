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
import Notification from "./Notification";
import MobileNotification from "./MobileNotification";

interface itemType {
  create: boolean;
  setCreate: (params: any) => any;
  search: boolean;
  setSearch: (params: any) => any;
  mobileNotification: boolean;
  setMobileNotification: (params: any) => any;
  notification: boolean;
  setNotification: (params: any) => any;
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

  const noLayoutRoutes = ["/privacy", "/about"];

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined" || noLayoutRoutes.includes(router.pathname)) return <></>;

  const switchLayout = () => {
    props.setlsTheme(data?.theme?.type === "dark" ? "light" : "dark");
    props.setTheme({ type: props.lsTheme, primary: data?.theme?.primary, secondary: data?.theme?.secondary, tertiary: data?.theme?.tertiary });
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
        <div className={"z-50 max-h-screen w-fit select-none " + data?.theme?.primary}>
          {props.create && <Create create={props.create} setCreate={props.setCreate} />}
          {props.search && <Search search={props.search} setSearch={props.setSearch} />}
          {props.notification && <Notification notification={props.notification} setNotification={props.setNotification} />}
          <div id="Sidebar" className={"fixed left-0 grid gap-4 " + (data?.viewport !== "Mobile" && data?.theme?.primary) + (data?.viewport == "Web" && " bottom-0 z-10 h-full w-72 grid-flow-row border-r transition-all duration-200 ") + (data?.viewport == "Tab" && " top-0 h-full w-16 grid-flow-row border-r transition-all duration-200 ") + (data?.viewport == "Mobile" && " top-0 h-screen w-screen grid-flow-col ") + (data?.theme?.type === "dark" ? " border-zinc-500 " : "  border-zinc-300 ")}>
            <div id="Sidebar-Items" className={"text-2xl font-light transition-all duration-200 " + (data?.viewport == "Web" && " ml-2 mt-5 ") + (data?.viewport == "Tab" && " ml-1 mt-5 ")}>
              <div onClick={() => onClickHandler("/")} className={"cursor-pointer text-2xl font-normal " + (data?.viewport == "Mobile" ? " hidden " : " grid ")}>
                {data?.viewport == "Web" ? (
                  <h1 className="ml-5 flex">
                    Clone<span className="bg-gradient-to-br from-red-300 via-pink-300 to-orange-100 bg-clip-text text-transparent">gram</span>
                  </h1>
                ) : (
                  <h1 className="ml-3 flex">
                    C<span className="bg-gradient-to-br from-red-300 via-pink-300 to-orange-100 bg-clip-text text-transparent">G</span>
                  </h1>
                )}
              </div>
              <div id="Sidebar-Web-View-Items" className={"mt-5 ml-2 grid-flow-row place-items-start gap-5 " + (data?.viewport == "Mobile" ? " hidden " : " grid ")}>
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} Text={"Home"} ID={"Home"} onClickHandler={() => onClickHandler("/")} active={Boolean(router.pathname == "/" && !props.create && !props.search && !props.more && !props.notification)} />
                <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} ID={"Search"} onClickHandler={() => props.setSearch(!props.search)} active={props.search} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} ID={"Explore"} onClickHandler={() => onClickHandler("/explore")} active={Boolean(router.pathname == "/explore" && !props.create && !props.search && !props.more && !props.notification)} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} ID={"Messages"} />
                <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} onClickHandler={() => props.setNotification(!props.notification)} active={props.notification} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} ID={"Create"} onClickHandler={() => props.setCreate(!props.create)} active={props.create} />
                <NavBarItem Icon={data?.user?.data.image} Text={"Profile"} ID={"Profile"} onClickHandler={() => onClickHandler("/profile/" + data?.user?.data.handle)} active={Boolean(router.query.profile === data?.user?.data.handle && !props.create && !props.search && !props.more)} />
              </div>
              <div id="Header-Mobile-View-Items" className={"absolute top-0 z-50 grid h-16 w-screen grid-flow-col place-items-center border-b border-zinc-600 " + data?.theme?.primary + (data?.viewport != "Mobile" && " hidden ") + (!["/", "/explore"].includes(router.pathname) && " hidden ")}>
                <h1 className="ml-3 flex text-2xl font-normal">
                  C<span className="bg-gradient-to-br from-red-300 via-pink-300 to-orange-100 bg-clip-text text-transparent">G</span>
                </h1>
                <MobileSearch />
                <div id="Sidebar-More" className={" group " + (data?.viewport !== "Mobile" && " hidden ")}>
                  <button type="button" aria-haspopup="true">
                    <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} onClickHandler={() => props.setMobileNotification(true)} active={props.mobileNotification} />
                  </button>
                  {props.mobileNotification && <MobileNotification notification={props.mobileNotification} setNotification={props.setMobileNotification} />}
                </div>
              </div>
              <div id="Footer-Mobile-View-Items" className={"fixed bottom-0 z-50 mt-[4px] grid h-12 w-screen grid-flow-col place-items-center border-t border-zinc-600 " + data?.theme?.primary + (data?.viewport != "Mobile" && " hidden ")}>
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} ID={"M-Home"} onClickHandler={() => onClickHandler("/")} active={Boolean(router.pathname == "/" && !props.create && !props.search && !props.more)} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} ID={"M-Explore"} onClickHandler={() => onClickHandler("/explore")} active={Boolean(router.pathname == "/explore" && !props.create && !props.search && !props.more && !props.notification)} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} ID={"M-Create"} onClickHandler={() => props.setCreate(!props.create)} active={props.create} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} ID={"M-Messages"} />
                <NavBarItem Icon={data?.user?.data.image} ID={"M-Profile"} onClickHandler={() => onClickHandler("/profile/" + data?.user?.data.handle)} active={Boolean(router.query.profile === data?.user?.data.handle && !props.create && !props.search && !props.more)} />
              </div>
              <div id="Sidebar-More" className={"group fixed bottom-5 left-3 " + (data?.viewport == "Mobile" && " hidden ")}>
                <button type="button" aria-haspopup="true">
                  <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} ID={"More"} onClickHandler={() => props.setMore(true)} active={props.more} />
                </button>
                {props.more && (
                  <div id="Sidebar-More-Items" className={"invisible fixed bottom-16 left-6 z-50 w-fit origin-bottom-left scale-95 transform rounded-lg py-1 text-sm opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 " + (data?.theme?.type === "dark" ? " shadow-[0px_0px_10px_rgba(255,255,255,0.2)] " : " shadow-[0px_0px_10px_rgba(0,0,0,0.2)] ") + data?.theme?.primary}>
                    <MoreItem Icon={<IoMdSettings />} Text="Settings" setMore={props.setMore} onClickHandler={() => router.push("/settings")} />
                    <MoreItem Icon={<RxBookmark />} Text="Saved" setMore={props.setMore} onClickHandler={() => router.push({ pathname: "/profile/" + data?.user?.data.handle, query: { saved: true } })} />
                    <MoreItem Icon={<RxTimer />} Text="Your Activity" setMore={props.setMore} />
                    <MoreItem Icon={<HiOutlineMoon />} Text="Switch Appearence" setMore={props.setMore} onClickHandler={switchLayout} />
                    <MoreItem Icon={<BiMessageAltError />} Text="Report a problem" setMore={props.setMore} />
                    <MoreItem Icon={<AiOutlineUserSwitch />} Text="Switch accounts" setMore={props.setMore} />
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
