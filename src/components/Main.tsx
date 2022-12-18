import { useState, useEffect, useRef } from "react";
import { AiOutlineHome, AiFillHome, AiOutlineHeart, AiFillHeart, AiOutlineUserSwitch } from "react-icons/ai";
import { MdOutlineExplore, MdExplore, MdLogout } from "react-icons/md";
import { BiSearchAlt2, BiMessageAltError } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { HiMenu, HiOutlineMenu } from "react-icons/hi";
import { RxBookmark, RxTimer } from "react-icons/rx";
import { RiMessage3Line, RiMessage3Fill, RiAddBoxLine, RiAddBoxFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NavBarItem from "./NavBarItem";
import MoreItem from "./MoreItem";
import Home from "./Home";
import Create from "./Create";
import Search from "./Search";
import Profile from "./Profile";

const Main: React.FC = () => {
  const [viewport, setViewport] = useState("");
  const [more, setMore] = useState(false);
  const [active, setActive] = useState("");
  const [create, setCreate] = useState(false);
  const [hook, setHook] = useState(<></>);
  const [search, setSearch] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (active !== "Create" && active !== "More") {
      setCreate(false);
    }

    if (active !== "Search") {
      setSearch(false);
      onResize();
    }

    switch (active) {
      case "Home":
        setHook(<Home />);
        break;
      case "Search":
        setViewport("Tab");
        setSearch(true);
        break;
      case "Create":
        setCreate(true);
        break;
      case "Profile":
        setHook(<Profile viewport={viewport} />);
        break;
      default:
        setHook(<></>);
        break;
    }
  }, [active, viewport]);

  const onResize = () => {
    if (document.body.clientWidth >= 1150) {
      if (active !== "Search") {
        setViewport("Web");
      } else {
        setViewport("Tab");
      }
    } else if (document.body.clientWidth >= 750) {
      setViewport("Tab");
    } else {
      setViewport("Mobile");
      setMore(false);
    }
  };

  if (typeof document !== "undefined") {
    useEffect(() => {
      onResize();
    }, [document.body.clientWidth]);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("resize", onResize);
  }

  return (
    <div className="select-none">
      <Create create={create} setCreate={setCreate} hook={hook} setActive={setActive} />
      <div id="Background" className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] ">
        <div id="Sidebar" className={"fixed bottom-0 left-0 grid gap-4 border-r-2 bg-white " + (viewport == "Web" && " z-10 h-full w-72 grid-flow-row transition-all duration-200 ") + (viewport == "Tab" && " top-0 h-full w-16 grid-flow-row transition-all duration-200 ") + (viewport == "Mobile" && " bottom-0 h-12 w-screen grid-flow-col ") + (create && " opacity-30 ")}>
          <div id="Sidebar-Items" className={"text-2xl font-light transition-all duration-200 " + (viewport == "Web" && " ml-2 mt-5 ") + (viewport == "Tab" && " ml-1 mt-5 ")}>
            <p className={"ml-5 " + (viewport == "Mobile" ? " hidden " : " grid ")}>{viewport == "Web" ? "CLONEGRAM" : "C"}</p>
            <div id="Sidebar-Web-View-Items" className={"mt-5 ml-2 grid-flow-row place-items-start gap-5 " + (viewport == "Mobile" ? " hidden " : " grid ")}>
              <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} Text={"Home"} ID={"Home"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} ID={"Search"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} ID={"Explore"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} ID={"Messages"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} ID={"Create"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<CgProfile />} IconOnClick={<CgProfile />} Text={"Profile"} ID={"Profile"} active={active} setActive={setActive} viewport={viewport} />
            </div>
            <div id="Sidebar-Mobile-View-Items" className={"mt-[4px] grid grid-flow-col place-items-center " + (viewport != "Mobile" && " hidden ")}>
              <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} ID={"M-Home"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} ID={"M-Explore"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} ID={"M-Create"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} ID={"M-Messages"} active={active} setActive={setActive} viewport={viewport} />
              <NavBarItem Icon={<CgProfile />} IconOnClick={<CgProfile />} ID={"M-Profile"} active={active} setActive={setActive} viewport={viewport} />
            </div>
            <div id="Sidebar-More" className={"fixed bottom-5 " + (viewport == "Mobile" && " hidden ")}>
              <div className={"ml-2"} onClick={() => setMore(!more)}>
                <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} ID={"More"} active={active} setActive={setActive} viewport={viewport} />
              </div>
              {more ? (
                <div id="Sidebar-More-Items" className="fixed bottom-12 left-4 z-10 w-48 rounded-lg bg-white text-sm shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
                  <MoreItem Icon={<IoMdSettings />} Text="Settings" onClickHandler={() => console.log("test")} />
                  <MoreItem Icon={<RxBookmark />} Text="Saved" />
                  <MoreItem Icon={<RxTimer />} Text="Your Activity" />
                  <MoreItem Icon={<BiMessageAltError />} Text="Report a problem" />
                  <div className="border-t-2">
                    <MoreItem Icon={<AiOutlineUserSwitch />} Text="Switch accounts" />
                  </div>
                  <MoreItem Icon={<MdLogout />} Text="Log out" onClickHandler={() => signOut({ callbackUrl: "http://localhost:3000/" })} />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <Search search={search} viewport={viewport} />
        <div className={" min-h-screen " + (viewport == "Tab" ? (search ? " ml-72 " : " ml-16 ") : " ") + (viewport == "Web" && " ml-72 ") + (create && " -z-10 opacity-30 ")}>{hook}</div>
      </div>
    </div>
  );
};

export default Main;
