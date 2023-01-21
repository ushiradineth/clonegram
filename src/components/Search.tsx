import React, { useEffect, useState, useContext } from "react";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";
import { DataContext } from "../pages/_app";
import ProfileLink from "./ProfileLink";
import InputBox from "./InputBox";

interface itemType {
  search: boolean;
  setSearch: (params: any) => any;
}

const Search = (props: itemType) => {
  const [isEmpty, setisEmpty] = useState(true);
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

    props.setSearch(false);
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
      <div className={"flex flex-col items-center justify-center rounded-2xl p-8 w-full " + data?.theme?.secondary}>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-4">
            <BiUserPlus className="scale-x-[-6] scale-y-[6] transform" />
          </div>
          <div className="text-sm">{props.text}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={"fixed top-0 left-16 z-30 h-screen rounded-r-xl transition-all duration-1000 " + (data?.theme?.type === "dark" ? " shadow-[5px_0px_50px_rgba(255,255,255,0.1)] " : " shadow-[25px_0px_50px_rgba(0,0,0,0.2)] ") + (props.search ? " z-10 w-[350px] border-l-2 " : " z-0 w-0 ") + (data?.viewport == "Mobile" && " hidden ") + data?.theme?.secondary}>
        <div className={"rounded-r-xl transition-all " + (props.search ? " opacity-100 " : " opacity-0 ") + data?.theme?.secondary}>
          <div className={"h-screen transition-all duration-200"}>
            <div className="grid w-full items-center border-b-[1px] font-semibold">
              <p className="mt-4 ml-4 text-xl">Search</p>
              <div className="m-4">
                <InputBox
                  id="search"
                  maxlength={50}
                  placeholder="Search"
                  action={
                    <AiFillCloseCircle
                      color="gray"
                      onClick={() => {
                        (document.getElementById("search") as HTMLInputElement).value = "";
                        setisEmpty(true);
                      }}
                      className="ml-16 cursor-pointer"
                    />
                  }
                />
              </div>
            </div>
            {usersList.isLoading ? (
              <div className="mt-6 grid place-items-center">
                <Spinner SpinnerOnly={true} />
              </div>
            ) : isEmpty ? (
              <div>
                <p className="mt-4 ml-4 text-lg ">Recent</p>
                <div className={"grid place-items-start"}>{recentSearches.length > 0 ? recentSearches.map((user, index) => <ProfileLink user={user} key={index} index={index} onClickHandler={() => onClickProfile(user)} action={<AiOutlineClose className={"scale-150 cursor-pointer " + (data?.theme?.type === "dark" ? " text-gray-300 hover:text-white " : " text-zinc-800 hover:text-black ")} onClick={() => removeRecentSearch(user)} />} />) : <NoResults text={"No recent searches"} />}</div>
              </div>
            ) : (
              <div className="grid place-items-start">{users.length > 0 ? users.map((user, index) => <ProfileLink user={user} key={index} index={index} onClickHandler={() => onClickProfile(user)} />) : <NoResults text={"No results found"} />}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
