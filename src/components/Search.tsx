import router from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

interface itemType {
  search: boolean;
  setSearch: (params: any) => any;
  viewport: string;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
}

const Search = (props: itemType) => {
  const [isEmpty, setisEmpty] = useState(true);
  const [recentSearches, setRecentSearches] = useState<{ userID: string; userName: string; userImage: string; userHandle: string }[]>([]);
  const [keyword, setKeyword] = useState<string>();
  const [users, setUsers] = useState<{ userID: string; userName: string; userImage: string; userHandle: string }[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const usersList = trpc.user.getUsersSearch.useMutation({
    onSuccess: (data) => {
      let dataArr: { userID: string; userName: string; userImage: string; userHandle: string }[] = [];
      data.forEach((user) => {
        if (user.name && user.image) dataArr.push({ userID: user.id, userName: user.name, userImage: user.image, userHandle: user.handle });
      });
      setUsers([...dataArr]);
    },
  });

  const onClickProfile = (user: { userID: string; userName: string; userImage: string; userHandle: any }) => {
    var tempRecentSearches = recentSearches;

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

  if (typeof document !== "undefined") {
    (document.getElementById("search") as HTMLInputElement) &&
      (document.getElementById("search") as HTMLInputElement).addEventListener("keyup", () => {
        clearTimeout(0);
        if ((document.getElementById("search") as HTMLInputElement).value) {
          setTimeout(() => setKeyword((document.getElementById("search") as HTMLInputElement).value), 1000);
        }
        setTimeout(() => setisEmpty(!Boolean((document.getElementById("search") as HTMLInputElement).value)), 1000);
      });
  }

  const removeRecentSearch = (user: { userID: string; userName: string; userImage: string; userHandle: any }) => {
    var tempRecentSearches = recentSearches;

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

    var tempRecentSearches: any[] = [];
    var oldRecentSearch = JSON.parse(localStorage.getItem("clonegram.recentSearch") || "{}");

    if (oldRecentSearch.forEach) {
      oldRecentSearch.forEach((element: any) => {
        tempRecentSearches.push(element);
      });

      setRecentSearches(tempRecentSearches);
    }
  }, []);

  const RecentSearches = () => {
    return (
      <div>
        <p className="mt-4 ml-4 text-lg ">Recent</p>
        <div className={"flex h-[80%] flex-col items-center justify-center"}>
          {recentSearches.length > 0 ? (
            recentSearches.map((user, index) => {
              return (
                <div key={index} className={"flex h-12 w-full items-center justify-center p-10"}>
                  <Image className={"w-12 cursor-pointer rounded-full"} onClick={() => onClickProfile(user)} src={user.userImage} height={props.viewport == "Mobile" ? 96 : 160} width={props.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
                  <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={() => onClickProfile(user)}>
                    <div>{user.userHandle}</div>
                    <div>{user.userName}</div>
                  </div>

                  <AiOutlineClose className={"scale-150 cursor-pointer " + (props.theme.type === "dark" ? " text-gray-300 hover:text-white " : " text-zinc-800 hover:text-black ")} onClick={() => removeRecentSearch(user)} />
                </div>
              );
            })
          ) : (
            <div className={"flex flex-col items-center justify-center rounded-2xl p-8 " + props.theme.secondary}>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                  <BiUserPlus className="scale-x-[-6] scale-y-[6] transform" />
                </div>
                <div className="text-sm">No recent searches.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SearchResults = () => {
    return (
      <div>
        {users.length > 0 ? (
          users.map((user, index) => {
            return (
              <div key={index} className={"flex h-12 w-full items-center justify-center p-10"}>
                <Image className={"w-12 cursor-pointer rounded-full"} onClick={() => onClickProfile(user)} src={user.userImage} height={props.viewport == "Mobile" ? 96 : 160} width={props.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
                <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={() => onClickProfile(user)}>
                  <div>{user.userHandle}</div>
                  <div>{user.userName}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={"flex flex-col items-center justify-center rounded-2xl p-8 " + props.theme.secondary}>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                <BiUserPlus className="scale-x-[-6] scale-y-[6] transform" />
              </div>
              <div className="text-sm">No results found</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={"fixed top-0 left-16 z-30 h-screen rounded-r-xl transition-all duration-1000 " + (props.theme.type === "dark" ? " shadow-[5px_0px_50px_rgba(255,255,255,0.1)] " : " shadow-[25px_0px_50px_rgba(0,0,0,0.2)] ") + (props.search ? " z-10 w-[350px] border-l-2 " : " z-0 w-0 ") + (props.viewport == "Mobile" && " hidden ") + props.theme.secondary}>
        <div className={"rounded-r-xl transition-all " + (props.search ? " opacity-100 " : " opacity-0 ") + props.theme.secondary}>
          <div className={"h-screen transition-all duration-200"}>
            <div className="grid w-full items-center border-b-[1px] font-semibold">
              <p className="mt-4 ml-4 text-xl">Search</p>
              <div className={"my-4 ml-4 flex h-[35px] w-[90%] items-center justify-center gap-2 rounded-lg " + props.theme.tertiary}>
                <input type="text" id="search" className={"h-full w-[86%] placeholder:text-gray-500 focus:outline-none " + props.theme.tertiary} placeholder="Search" maxLength={50}></input>
                <AiFillCloseCircle
                  color="gray"
                  onClick={() => {
                    (document.getElementById("search") as HTMLInputElement).value = "";
                    setisEmpty(true);
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {isEmpty ? <RecentSearches /> : <SearchResults />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
