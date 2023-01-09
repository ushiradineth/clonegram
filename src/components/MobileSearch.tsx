import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { BiUserPlus } from "react-icons/bi";
import { trpc } from "../utils/trpc";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import ProfileLink from "./ProfileLink";

const MobileSearch = () => {
  const [isEmpty, setisEmpty] = useState(true);
  const [focus, setFocus] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{ userID: string; userName: string; userImage: string; userHandle: string }[]>([]);
  const [keyword, setKeyword] = useState<string>();
  const [users, setUsers] = useState<{ userID: string; userName: string; userImage: string; userHandle: string }[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const data = useContext(DataContext);

  const usersList = trpc.user.getUsersSearch.useMutation({
    onSuccess: (data) => {
      const dataArr: { userID: string; userName: string; userImage: string; userHandle: string }[] = [];
      data.forEach((user) => {
        if (user.name && user.image) dataArr.push({ userID: user.id, userName: user.name, userImage: user.image, userHandle: user.handle });
      });
      setUsers([...dataArr]);
    },
  });

  const onClickProfile = (user: { userID: string; userName: string; userImage: string; userHandle: any }) => {
    const tempRecentSearches = recentSearches;

    tempRecentSearches.forEach((element, index) => {
      if (element.userID === user.userID) {
        tempRecentSearches.splice(index, 1);
      }
    });

    tempRecentSearches.splice(0, 0, user);
    tempRecentSearches.splice(5, 1);

    localStorage.setItem("clonegram.recentSearch", JSON.stringify(tempRecentSearches));

    router.push({ pathname: "/" + user.userHandle });
  };

  if (typeof document !== "undefined" || typeof window !== "undefined") {
    (document.getElementById("search") as HTMLInputElement) &&
      (document.getElementById("search") as HTMLInputElement).addEventListener("keyup", () => {
        clearTimeout(0);
        if ((document.getElementById("search") as HTMLInputElement).value) {
          setTimeout(() => setKeyword((document.getElementById("search") as HTMLInputElement)?.value), 1000);
        }
        setTimeout(() => setisEmpty(!Boolean((document.getElementById("search") as HTMLInputElement)?.value)), 1000);
      });
  }

  const removeRecentSearch = (user: { userID: string; userName: string; userImage: string; userHandle: any }) => {
    const tempRecentSearches = recentSearches;

    tempRecentSearches.forEach((element, index) => {
      if (element.userID === user.userID) {
        tempRecentSearches.splice(index, 1);
      }
    });

    localStorage.setItem("clonegram.recentSearch", JSON.stringify(tempRecentSearches));
    setRecentSearches(tempRecentSearches);
  };

  useEffect(() => {
    setUsers([]);
    if (keyword) {
      usersList.mutate({ key: keyword });
    }
  }, [keyword]);

  useEffect(() => {
    if (localStorage.getItem("clonegram.userID") !== session?.user?.id) {
      localStorage.removeItem("clonegram.recentSearch");
      if (session?.user?.id) localStorage.setItem("clonegram.userID", session?.user?.id);
    }

    const tempRecentSearches: any[] = [];
    const oldRecentSearch = JSON.parse(localStorage.getItem("clonegram.recentSearch") || "{}");

    if (oldRecentSearch.forEach) {
      oldRecentSearch.forEach((element: any) => {
        tempRecentSearches.push(element);
      });

      setRecentSearches(tempRecentSearches);
    }
  }, []);

  const NoResults = (props: { text: string }) => {
    return (
      <div className="flex flex-col items-center justify-center p-4 pt-8">
        <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
          <BiUserPlus className="scale-x-[-4] scale-y-[4] transform" />
        </div>
        <div className="text-sm">{props.text}</div>
      </div>
    );
  };

  return (
    <>
      <div onFocus={() => setFocus(true)} className={"z-30 h-10 w-full rounded-xl " + (data?.theme?.type === "dark" ? " shadow-[5px_0px_50px_rgba(255,255,255,0.1)] " : " shadow-[0px_0px_25px_rgba(0,0,0,0.2)] ") + data?.theme?.secondary}>
        <div className={"flex flex-row items-center gap-1 rounded-xl px-2 py-[2px] " + data?.theme?.secondary}>
          <input autoComplete={"off"} type="text" id="search" className={"w-full text-zinc-300 placeholder:text-gray-500 focus:outline-none " + data?.theme?.secondary} placeholder="Search" maxLength={50}></input>
          <AiFillCloseCircle
            color="gray"
            onClick={() => {
              (document.getElementById("search") as HTMLInputElement).value = "";
              setisEmpty(true);
              setFocus(false);
            }}
            className="mt-1 cursor-pointer"
          />
        </div>
      </div>

      {focus && (
        <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className={"fixed top-20 flex h-fit max-h-72 w-fit min-w-[250px] max-w-[450px] items-center justify-center rounded-2xl pt-2 pb-8 " + data?.theme?.primary}>
          {usersList.isLoading ? (
            <div className="mt-6 grid place-items-center">
              <Spinner SpinnerOnly={true} />
            </div>
          ) : isEmpty ? (
            <div>
              <p className="mt-4 ml-4 text-lg ">Recent</p>
              <div className={"grid place-items-center"}>{recentSearches.length > 0 ? recentSearches.map((user, index) => <ProfileLink user={user} index={index} onClickHandler={() => onClickProfile(user)} action={<AiOutlineClose className={"scale-150 cursor-pointer " + (data?.theme?.type === "dark" ? " text-gray-300 hover:text-white " : " text-zinc-800 hover:text-black ")} onClick={() => removeRecentSearch(user)} />} />) : <NoResults text={"No recent searches"} />}</div>
            </div>
          ) : (
            <div className="grid place-items-center">{users.length > 0 ? users.map((user, index) => <ProfileLink user={user} index={index} onClickHandler={() => onClickProfile(user)} />) : <NoResults text={"No results found"} />}</div>
          )}
        </div>
      )}
    </>
  );
};

export default MobileSearch;
