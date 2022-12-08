import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Loading from "./loading";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { HiHome } from "react-icons/hi";
import { MdOutlineExplore, MdOutlineAddBox, MdExplore } from "react-icons/md";
import { BiMessageRounded, BiSearchAlt2 } from "react-icons/Bi";
import {
  RiMessage3Line,
  RiMessage3Fill,
  RiAddBoxLine,
  RiAddBoxFill,
} from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

// const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
// {hello.data ? hello.data.greeting : "Loading tRPC query..."}
// const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//   undefined, // no input
//   { enabled: sessionData?.user !== undefined }
// );
// {secretMessage && <span> - {secretMessage}</span>}

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  if (status == "loading") {
    return <Loading />;
  }

  if (!hello.data) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 sm:gap-12 ">
          <div className="flex flex-col items-center gap-2">
            <NavBar />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const NavBar: React.FC = () => {
  //redirecting to index if not authenticated
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status == "unauthenticated") {
    router.push("/");
  }

  const [card, setCard] = useState("hidden");

  return (
    <div className="fixed top-0 left-0 grid h-full w-72 grid-flow-row gap-4 bg-white">
      <div className="fixed left-0 grid w-full grid-flow-row gap-4">
        <div className="mt-5 ml-5 text-2xl font-light">
          CLONEGRAM
          <div className="mt-5 grid grid-flow-row place-items-start gap-5">
            <Item
              Icon={<AiOutlineHome />}
              IconOnClick={<AiFillHome />}
              Text={"Home"}
            />
            <Item
              Icon={<BiSearchAlt2 />}
              IconOnClick={<FaSearch />}
              Text={"Search"}
            />
            <Item
              Icon={<MdOutlineExplore />}
              IconOnClick={<MdExplore />}
              Text={"Explore"}
            />
            <Item
              Icon={<RiMessage3Line />}
              IconOnClick={<RiMessage3Fill />}
              Text={"Messages"}
            />
            <Item
              Icon={<AiOutlineHeart />}
              IconOnClick={<AiFillHeart />}
              Text={"Notifications"}
            />
            <Item
              Icon={<RiAddBoxLine />}
              IconOnClick={<RiAddBoxFill />}
              Text={"Create"}
            />
            <Item
              Icon={<CgProfile />}
              IconOnClick={<CgProfile />}
              Text={"Profile"}
            />
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
  );
};

interface itemType {
  Icon: JSX.Element;
  IconOnClick: JSX.Element;
  Text: string;
}

const Item = (props: itemType) => {
  const [scale, setScale] = useState(false);
  const [click, setClick] = useState(false);

  return (
    <div
      className="grid grid-flow-col place-items-center"
      onMouseEnter={() => setScale(true)}
      onMouseLeave={() => setScale(false)}
      onClick={() => setClick(!click)}
    >
      <div
        className={`transition-all duration-200 ${
          scale ? "scale-110" : "scale-100"
        }`}
      >
        {click ? props.IconOnClick : props.Icon}
      </div>
      <p className="ml-2 text-sm font-normal">{props.Text}</p>
    </div>
  );
};
