import { useState, useEffect } from "react";
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
import NavBarItem from "./NavBarItem";
import MoreItem from "./MoreItem";

const NavBar: React.FC = () => {
  //redirecting to index if not authenticated
  const { data: session, status } = useSession();
  const [card, setCard] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    if (document.body.clientWidth >= 1150) {
      setCard(true);
      setVertical(false);
    } else if (document.body.clientWidth >= 750) {
      setCard(false);
      setVertical(false);
    } else {
      setCard(false);
      setMore(false);
      setVertical(true);
    }
  }, []);

  const onResize = () => {
    if (document.body.clientWidth >= 1150) {
      setCard(true);
      setVertical(false);
    } else if (document.body.clientWidth >= 750) {
      setCard(false);
      setVertical(false);
    } else {
      setCard(false);
      setMore(false);
      setVertical(true);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("resize", onResize);
  }

  return (
    <>
      {!vertical ? (
        <div className="fixed top-0 left-0 grid h-full w-16 grid-flow-row gap-4 bg-white lg:w-72">
          <div className="fixed left-0 grid w-full grid-flow-row gap-4">
            <div className="mt-5 ml-5 text-2xl font-light">
              {card ? <p className="invisible lg:visible">CLONEGRAM</p> : <p className="visible ml-[4px] lg:invisible">C</p>}
              <div className="mt-5 grid grid-flow-row place-items-start gap-5">
                <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} Text={"Home"} />
                <NavBarItem Icon={<BiSearchAlt2 />} IconOnClick={<FaSearch />} Text={"Search"} />
                <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} Text={"Explore"} />
                <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} Text={"Messages"} />
                <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} Text={"Notifications"} />
                <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} Text={"Create"} />
                <NavBarItem Icon={<CgProfile />} IconOnClick={<CgProfile />} Text={"Profile"} />
              </div>
              <div className="fixed bottom-5">
                <div onClick={() => setMore(!more)}>
                  <NavBarItem Icon={<HiOutlineMenu />} IconOnClick={<HiMenu />} Text={"More"} />
                </div>
                {more ? (
                  <div className="fixed bottom-12 left-4 z-10 w-48 rounded-lg bg-white text-sm shadow-[0px_0px_10px_rgba(0,0,0,0.1)]" onBlur={() => setMore(false)}>
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
        </div>
      ) : (
        <div>
          <div className="fixed top-0 left-0 flex h-12 w-full items-center bg-white">
            <p className="ml-4">CLONEGRAM</p>
            <div className="fixed right-16 flex h-[30px] w-56 items-center rounded-lg bg-gray-200">
              <div className="ml-2 fill-blue-500">
                <BiSearchAlt2 color="gray" />
              </div>
              <p className="ml-1 text-sm text-gray-500">Search</p>
            </div>
            <div className="fixed right-6">
              <NavBarItem Icon={<AiOutlineHeart />} IconOnClick={<AiFillHeart />} />
            </div>
          </div>
          <div className="fixed bottom-0 left-0 grid h-12 w-full grid-flow-col place-items-center bg-white">
            <NavBarItem Icon={<AiOutlineHome />} IconOnClick={<AiFillHome />} />
            <NavBarItem Icon={<MdOutlineExplore />} IconOnClick={<MdExplore />} />
            <NavBarItem Icon={<RiAddBoxLine />} IconOnClick={<RiAddBoxFill />} />
            <NavBarItem Icon={<RiMessage3Line />} IconOnClick={<RiMessage3Fill />} />
            <NavBarItem Icon={<CgProfile />} IconOnClick={<CgProfile />} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
