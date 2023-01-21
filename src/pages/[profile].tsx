import React, { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Spinner from "../components/Spinner";
import ListOfUsers from "../components/ListOfUsers";
import ProfileOptions from "../components/ProfileOptions";
import Error from "../components/Error";
import { type UserType } from "../types/types";
import Head from "next/head";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import { TfiLayoutGrid3, TfiLayoutGrid3Alt } from "react-icons/tfi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoMdAlbums } from "react-icons/io";

const Profile = () => {
  const [options, setOptions] = useState(false);
  const [isBlockedBy, setIsBlockedBy] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(new Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }>());
  const [following, setFollowing] = useState(new Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }>());
  const [followersMenu, setFollowersMenu] = useState(false);
  const [followingMenu, setFollowingMenu] = useState(false);
  const [tab, setTab] = useState("Posts");

  const { data: session, status } = useSession();
  const router = useRouter();
  const profile = router.query.profile as string;
  const data = useContext(DataContext);

  const query = trpc.user.getUserByHandle.useQuery({ handle: String(profile) }, { retry: false, refetchOnWindowFocus: false, enabled: Boolean(((status === "authenticated" && session?.user?.handle !== String(profile)) || status === "unauthenticated") && !router.query.user) });
  const page = session?.user?.handle !== String(profile) ? query : data?.user;

  useEffect(() => {
    setIsFollowing(false);
    setFollowersMenu(false);
    setFollowingMenu(false);
    setIsBlockedBy(false);
    setIsBlocking(false);
    setOptions(false);
    setTab("Posts");
    document.dispatchEvent(new Event("visibilitychange"));
  }, [router.query]);

  const follow = trpc.user.follow.useMutation({
    onSuccess: () => {
      page?.refetch();
      data?.user?.refetch();
      setIsFollowing(true);
    },
  });

  const unfollow = trpc.user.unfollow.useMutation({
    onSuccess: () => {
      page?.refetch();
      data?.user?.refetch();
      setIsFollowing(false);
    },
  });

  const followFunc = () => {
    if (session?.user?.id && page?.data?.id) {
      follow.mutate({ userid: session.user?.id, pageid: page?.data?.id });
    }
  };

  const unfollowFunc = () => {
    if (session?.user?.id && page?.data?.id) {
      unfollow.mutate({ userid: session?.user?.id, pageid: page?.data?.id });
    }
  };

  useEffect(() => {
    if (page?.isSuccess) {
      const userfollowing: Array<string> = [];
      const followersArray: Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }> = [];
      const followingArray: Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }> = [];

      if (session) {
        data?.user?.data.following.forEach((element: { handle: string }) => {
          userfollowing.push(element.handle);
        });

        if (data?.user?.data.handle !== String(profile)) {
          data?.user?.data.blockedby.forEach((element: { id: string | undefined }) => {
            if (element.id === page?.data?.id && !isBlocking && !isBlockedBy) setIsBlockedBy(true);
          });

          data?.user?.data.blocking.forEach((element: { id: string | undefined }) => {
            if (element.id === page?.data?.id && !isBlockedBy && !isBlocking) setIsBlocking(true);
          });
        }
      }

      page?.data?.following.forEach((element: { name: any; image: any; id: any; handle: string }) => {
        if (element.name && element.image) followingArray.push({ UserID: element.id, UserName: element.name, UserHandle: element.handle, UserImage: element.image, UserFollowing: userfollowing.indexOf(element.handle) > -1 || false, UserRemoved: false });
      });

      page?.data?.followers.forEach((element: { name: any; image: any; id: string; handle: string }) => {
        if (element.name && element.image) followersArray.push({ UserID: element.id, UserName: element.name, UserHandle: element.handle, UserImage: element.image, UserFollowing: userfollowing.indexOf(element.handle) > -1 || false, UserRemoved: false });
        if (element.id === session?.user?.id && !isFollowing) setIsFollowing(true);
      });

      setFollowing(followingArray);
      setFollowers(followersArray);
    }
  }, [page?.data]);

  if (page?.isLoading) return <Spinner />;
  if (status === "unauthenticated" ? page?.isError : session?.user?.handle === String(profile) ? page?.isError : page?.data?.handle === String(profile) ? false : page?.data?.handle !== String(profile)) return <Error error="User does not exist" session={Boolean(session)} />;
  if (isBlocking) return <Error error="You have blocked this user" session={Boolean(session)} />;
  if (isBlockedBy) return <Error error="This user has blocked you" session={Boolean(session)} />;

  if (!isBlockedBy && !isBlocking)
    return (
      <>
        <Head>
          <title>{`${page?.data?.name} (@${page?.data?.handle})	• Clonegram`}</title>
          <meta name="description" content="Clonegram by Ushira Dineth" />
          <link rel="icon" href={"/favicon.ico"} />
        </Head>
        <main>
          {followersMenu && <ListOfUsers users={followers} userSetter={() => setFollowers} onClickNegative={() => setFollowersMenu(false)} title="Followers" userHandle={session?.user?.handle} userID={session?.user?.id} pageID={page?.data?.id ? page?.data.id : "0"} />}
          {followingMenu && <ListOfUsers users={following} userSetter={() => setFollowing} onClickNegative={() => setFollowingMenu(false)} title="Following" userHandle={session?.user?.handle} userID={session?.user?.id} pageID={page?.data?.id ? page?.data.id : "0"} />}
          {options && <ProfileOptions onClickNegative={() => setOptions(false)} page={page as UserType} refetch={data?.user?.refetch} setIsBlocking={setIsBlocking} />}
          {!session && (
            <div className={"fixed bottom-0 left-0 flex h-12 w-screen items-center justify-center gap-2 " + data?.theme?.primary}>
              Sign in to Clonegram to see more!
              <button className={"rounded-full px-4 py-2 font-semibold no-underline transition " + data?.theme?.tertiary} onClick={() => router.push("/")}>
                Sign in
              </button>
            </div>
          )}
          <div className={" " + (data?.viewport == "Web" && session && " ml-72 ") + (data?.viewport == "Tab" && session && " ml-16 ")}>
            <div id="Background" className={"flex h-fit flex-col items-center " + data?.theme?.secondary}>
              <div className="mt-8 grid w-fit place-items-center">
                <div id="user-details" className={"flex h-fit py-5 " + (data?.viewport == "Mobile" && " w-[400px] ") + (data?.viewport == "Web" && " w-[700px] items-center justify-center ") + (data?.viewport == "Tab" && " w-[500px] items-center justify-center ")}>
                  <Image className={"rounded-full " + (data?.viewport == "Mobile" ? " mr-2 ml-2 mt-4 h-24 w-24 " : " mr-10 flex w-24 scale-125 justify-center ")} src={page?.data?.image ? page?.data?.image : ""} height={96} width={96} alt="Profile Picture" priority />
                  <div id="headline" className={"mb-4 mt-6 ml-4 grid grid-flow-row " + (data?.viewport != "Mobile" && " h-fit gap-3 ")}>
                    <div id="user-info">
                      <div className="flex items-center gap-3">
                        <div id="id" className="max-w-[200px] overflow-hidden text-ellipsis text-xl">
                          {page?.data?.handle}
                        </div>
                        <button id="cta" disabled={follow.isLoading || unfollow.isLoading} className={"text-xs font-semibold disabled:cursor-not-allowed " + (data?.viewport === "Mobile" && " hidden ") + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => (session ? (session?.user?.id === page?.data?.id ? router.push("/settings") : isFollowing ? unfollowFunc() : followFunc()) : router.push("/"))}>
                          {session?.user?.id === page?.data?.id ? "Edit profile" : follow.isLoading || unfollow.isLoading ? <Spinner SpinnerOnly={true} /> : isFollowing ? "Following" : "Follow"}
                        </button>
                        {session?.user?.id === page?.data?.id ? <IoMdSettings id="settings" className="scale-150" onClick={() => router.push("/settings")} /> : <BsThreeDots className="scale-150 cursor-pointer" onClick={() => (session ? setOptions(true) : router.push("/"))} />}
                      </div>
                    </div>
                    <button id="cta-mobile" disabled={follow.isLoading || unfollow.isLoading} className={"z-10 mt-2 flex h-fit w-[235px] items-center justify-center p-2 text-xs font-semibold disabled:cursor-not-allowed " + (data?.viewport != "Mobile" && " hidden ") + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border-2 py-1 px-2 ")} onClick={() => (session ? (session?.user?.id === page?.data?.id ? router.push("/settings") : isFollowing ? unfollowFunc() : followFunc()) : router.push("/"))}>
                      {session?.user?.id === page?.data?.id ? "Edit profile" : follow.isLoading || unfollow.isLoading ? <Spinner SpinnerOnly={true} /> : isFollowing ? "Following" : "Follow"}
                    </button>

                    <div id="stats" className={"grid grid-flow-col gap-2 text-sm font-normal  " + (data?.viewport == "Mobile" && " hidden ")}>
                      <div className="flex gap-1">
                        <p className="font-semibold">{page?.data?.posts.length}</p>
                        <p className={data?.theme?.type === "dark" ? "text-gray-300" : "text-black"}>posts</p>
                      </div>
                      <button className="flex gap-1" onClick={() => (session ? setFollowersMenu(true) : router.push("/"))}>
                        <p className="font-semibold">{page?.data?.followers.length}</p>
                        <p className={data?.theme?.type === "dark" ? "text-gray-300" : "text-black"}>followers</p>
                      </button>
                      <button className="flex gap-1" onClick={() => (session ? setFollowingMenu(true) : router.push("/"))}>
                        <p className="font-semibold">{page?.data?.following.length}</p>
                        <p className={data?.theme?.type === "dark" ? "text-gray-300" : "text-black"}>following</p>
                      </button>
                    </div>
                    <div id="details" className={"text-sm font-semibold " + (data?.viewport == "Mobile" && " hidden ")}>
                      <div id="name">{page?.data?.name}</div>
                      <div id="bio" className={"mr-2 grid w-72 grid-flow-col break-all " + (page?.data?.bio ? "" : " hidden ")}>
                        {page?.data?.bio}
                      </div>
                    </div>
                  </div>
                </div>
                <div id="details-mobile" className={"mb-5 w-[460px] px-8 text-sm font-semibold " + (data?.viewport != "Mobile" && " hidden ")}>
                  <div id="name" className="">
                    {page?.data?.name}
                  </div>
                  <div id="bio" className={"grid grid-flow-col break-all " + (page?.data?.bio ? "" : " hidden ")}>
                    {page?.data?.bio}
                  </div>
                </div>
                <div id="stats-mobile" className={"z-10 grid w-full grid-flow-col place-items-center border-y border-zinc-700 py-2 text-sm font-normal " + (data?.viewport != "Mobile" && " hidden ")}>
                  <div className="grid place-items-center">
                    <p className="font-semibold">{page?.data?.posts.length}</p>
                    <p className={data?.theme?.type === "dark" ? "text-gray-300" : "text-black"}>posts</p>
                  </div>
                  <button className="grid place-items-center" onClick={() => (session ? setFollowersMenu(true) : router.push("/"))}>
                    <p className="font-semibold">{page?.data?.followers.length}</p>
                    <p className={data?.theme?.type === "dark" ? "text-gray-300" : "text-black"}>followers</p>
                  </button>
                  <button className="grid place-items-center" onClick={() => (session ? setFollowingMenu(true) : router.push("/"))}>
                    <p className="font-semibold">{page?.data?.following.length}</p>
                    <p className={data?.theme?.type === "dark" ? "text-gray-300" : "text-black"}>following</p>
                  </button>
                </div>
                <div id="selection" className={"flex h-12 items-center justify-center gap-2 border-zinc-700 " + (data?.user?.data.handle !== page?.data?.handle ? " hidden " : "") + (data?.viewport === "Mobile" ? " w-full border-b " : " w-full border-t ")}>
                  <div onClick={() => setTab("Posts")} className={"z-10 flex h-full cursor-pointer items-center justify-center gap-2 px-2 " + (tab === "Posts" && "  border-y ")}>
                    <TfiLayoutGrid3 /> Posts
                  </div>
                  <div onClick={() => setTab("Saved")} className={"z-10 flex h-full cursor-pointer items-center justify-center gap-2 px-2 " + (tab === "Saved" && "  border-y ")}>
                    <BsBookmark /> Saved
                  </div>
                </div>
                <div id={tab} className={"flex h-fit min-h-screen w-fit items-start justify-center " + (data?.viewport !== "Mobile" && " border-t border-zinc-700 ")}>
                  <div className={"col-span-3 mt-1 grid grid-cols-3 place-items-center gap-1 " + (data?.viewport == "Mobile" && " mb-10 ")}>
                    {(tab === "Posts" ? page?.data?.posts.length : data?.user?.data.saved.length) ? (
                      (tab === "Posts" ? page?.data?.posts : data?.user?.data.saved)
                        ?.slice(0)
                        .reverse()
                        .map((element, index) => (
                          <div key={index} className={"relative w-fit h-fit"}>
                            {element.imageURLs.length > 1 && <IoMdAlbums className=" absolute right-[4%] top-[4%] w-[8%] h-[8%] max-w-[30px] shadow-sm rotate-180" />}
                            <Image src={element.imageURLs[0] || "/image-placeholder.png"} height={500} width={500} onClick={() => router.push("/post/" + element.id)} alt={element.id} key={index} className={"z-10 aspect-1 h-full max-h-[300px] w-full max-w-[300px] cursor-pointer bg-red-300 object-cover "}></Image>
                          </div>
                        ))
                    ) : (
                      <div className="min-w-screen col-span-3 mt-8 flex h-full min-h-screen w-full flex-col items-center">
                        <>
                          <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                            <FiCamera className="scale-x-[-5] scale-y-[5] transform" />
                          </div>
                          <div className="text-xl">No posts yet</div>
                        </>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
};

export default Profile;
