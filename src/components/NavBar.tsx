import { useState, useEffect } from "react";
import { AiOutlineHome, AiFillHome, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/Bi";
import { RiMessage3Line, RiMessage3Fill, RiAddBoxLine, RiAddBoxFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NavBarItem from "./NavBarItem";

const NavBar: React.FC = () => {
  //redirecting to index if not authenticated
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status == "unauthenticated") {
    router.push("/");
  }

  const [card, setCard] = useState(false);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    if (document.body.clientWidth >= 1150) {
      setCard(true);
      setVertical(false);
    } else if (document.body.clientWidth >= 750) {
      setCard(false);
      setVertical(false);
    } else {
      setCard(false);
      setVertical(true);
    }
  }, []);

  var onresize = function () {
    if (document.body.clientWidth >= 1150) {
      setCard(true);
      setVertical(false);
    } else if (document.body.clientWidth >= 750) {
      setCard(false);
      setVertical(false);
    } else {
      setCard(false);
      setVertical(true);
    }
  };

  window.addEventListener("resize", onresize);

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
            </div>
          </div>
          {/* <p className="text-center text-sm text-white sm:text-2xl">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
      >
        Sign out
      </button> */}
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
