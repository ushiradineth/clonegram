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

const Profile = () => {
  const [options, setOptions] = useState(false);
  const [isBlockedBy, setIsBlockedBy] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(new Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }>());
  const [following, setFollowing] = useState(new Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }>());
  const [followersMenu, setFollowersMenu] = useState(false);
  const [followingMenu, setFollowingMenu] = useState(false);

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
                <div id="stats-mobile" className={"z-10 grid w-[90%] grid-flow-col place-items-center border-y border-gray-500 py-2 text-sm font-normal " + (data?.viewport != "Mobile" && " hidden ")}>
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
                <div id="posts" className={"grid h-fit min-h-screen grid-cols-3 place-items-start py-10 " + (data?.viewport == "Web" && " w-[832px] border-t border-gray-500 px-24 ") + (data?.viewport == "Tab" && " w-[600px] border-t border-gray-500 ")}>
                  <div className={"col-span-3 grid w-[90%] grid-cols-3 place-items-start gap-1 " + (data?.viewport == "Mobile" && " mb-10 ")}>
                    {page?.data?.posts.length ? (
                      page.data.posts
                        .slice(0)
                        .reverse()
                        .map((element, index) => <Image src={element.imageURLs[0] || ""} height={500} width={500} onClick={() => router.push("/post/" + element.id)} alt={element.id} key={index} className={"cursor-pointer bg-red-300 object-cover " + (data?.viewport == "Mobile" && " h-40 w-40 ") + (data?.viewport == "Web" && " h-48 w-48 ") + (data?.viewport == "Tab" && " h-48 w-48 ")} />)
                    ) : (
                      <div className="col-span-3 flex h-full min-h-screen w-full flex-col items-center p-4">
                        <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                          <FiCamera className="scale-x-[-5] scale-y-[5] transform" />
                        </div>
                        <div className="text-xl">No posts yet</div>
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
