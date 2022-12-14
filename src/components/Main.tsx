import { useState, useEffect, useRef } from "react";
import { AiOutlineHome, AiFillHome, AiOutlineHeart, AiFillHeart, AiOutlineUserSwitch } from "react-icons/ai";
import { MdOutlineExplore, MdExplore, MdLogout } from "react-icons/md";
import { BiSearchAlt2, BiMessageAltError } from "react-icons/Bi";
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

const Main: React.FC = () => {
  //redirecting to index if not authenticated
  const { data: session, status } = useSession();
  const [card, setCard] = useState(false);
  const [more, setMore] = useState(false);
  const [active, setActive] = useState("");
  const [create, setCreate] = useState(false);
  const [hook, setHook] = useState(<Home />);
  const router = useRouter();

  useEffect(() => {
    if (active !== "Create") {
      setCreate(false);
    }
    switch (active) {
      case "Home":
        setHook(<Home />);
        break;
      case "Create":
        setCreate(true);
        break;
      default:
        setHook(<></>);
        break;
    }
  }, [active]);

  const onResize = () => {
    if (document.body.clientWidth >= 1150) {
      setCard(true);
    } else if (document.body.clientWidth >= 750) {
      setCard(false);
    } else {
      setCard(false);
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
    <>
      <Create create={create} setCreate={setCreate} hook={hook} setActive={setActive} />
      <div id="Background" className={create ? "flex min-h-screen flex-col items-center justify-center bg-black" : "flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"}>
        <div id="Sidebar" className={create ? "fixed bottom-0 right-0 grid h-12 w-full grid-flow-col gap-4 bg-white opacity-30 md:top-0 md:left-0 md:h-full md:w-16 md:grid-flow-row lg:w-72" : "fixed bottom-0 right-0 grid h-12 w-full grid-flow-col gap-4 bg-white md:top-0 md:left-0 md:h-full md:w-16 md:grid-flow-row lg:w-72"}>
          <div id="Sidebar-Items" className="text-2xl font-light md:mt-5 md:ml-1 lg:ml-2">
            {card ? <p className="ml-5 hidden lg:grid">CLONEGRAM</p> : <p className="ml-5 hidden md:grid">C</p>}
            <div id="Sidebar-Web-View-Items" className="mt-5 ml-2 hidden grid-flow-row place-items-start gap-5 md:visible md:grid">
              <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} Text={"Home"} ID={"Home"} active={active} setActive={setActive} />
              <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} ID={"Search"} active={active} setActive={setActive} />
              <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} ID={"Explore"} active={active} setActive={setActive} />
              <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} ID={"Messages"} active={active} setActive={setActive} />
              <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} ID={"Notifications"} active={active} setActive={setActive} />
              <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} ID={"Create"} active={active} setActive={setActive} />
              <NavBarItem Icon={<CgProfile />} IconOnClick={<CgProfile />} Text={"Profile"} ID={"Profile"} active={active} setActive={setActive} />
            </div>
            <div id="Sidebar-Mobile-View-Items" className="mt-[12px] grid grid-flow-col place-items-center md:hidden">
              <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} ID={"M-Home"} active={active} setActive={setActive} />
              <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} ID={"M-Explore"} active={active} setActive={setActive} />
              <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} ID={"M-Create"} active={active} setActive={setActive} />
              <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} ID={"M-Messages"} active={active} setActive={setActive} />
              <NavBarItem Icon={<CgProfile />} IconOnClick={<CgProfile />} ID={"M-Profile"} active={active} setActive={setActive} />
            </div>
            <div id="Sidebar-More" className="fixed bottom-5 hidden md:block">
              <div className="md:ml-2 lg:ml-2" onClick={() => setMore(!more)}>
                <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} ID={"More"} active={active} setActive={setActive} />
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
        <div className="md:ml-16 lg:ml-72">{hook}</div>
      </div>
    </>
  );
};

export default Main;
