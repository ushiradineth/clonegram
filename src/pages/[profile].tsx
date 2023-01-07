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
import { UserType } from "../types/types";
import Head from "next/head";

interface itemType {
  viewport: string;
  supabase: unknown;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  user: UserType;
}

const Profile = (props: itemType) => {
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

  const query = trpc.user.getUserByHandle.useQuery({ handle: String(profile) }, { retry: false, refetchOnWindowFocus: false, enabled: Boolean(((status === "authenticated" && session?.user?.handle !== String(profile)) || status === "unauthenticated") && !router.query.user) });
  const page = session?.user?.handle !== String(profile) ? query : props.user;

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
      page.refetch();
      props.user.refetch();
      setIsFollowing(true);
    },
  });

  const unfollow = trpc.user.unfollow.useMutation({
    onSuccess: () => {
      page.refetch();
      props.user.refetch();
      setIsFollowing(false);
    },
  });

  const followFunc = () => {
    if (session?.user?.id && page.data?.id) {
      follow.mutate({ userid: session.user?.id, pageid: page.data?.id });
    }
  };

  const unfollowFunc = () => {
    if (session?.user?.id && page.data?.id) {
      unfollow.mutate({ userid: session?.user?.id, pageid: page.data?.id });
    }
  };

  useEffect(() => {
    if (page.isSuccess) {
      const userfollowing: Array<string> = [];
      const followersArray: Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }> = [];
      const followingArray: Array<{ UserID: string; UserName: string; UserHandle: string; UserImage: string; UserFollowing: boolean; UserRemoved: boolean }> = [];

      if (session) {
        props.user?.data.following.forEach((element: { handle: string }) => {
          userfollowing.push(element.handle);
        });

        if (props.user.data.handle !== String(profile)) {
          props.user.data.blockedby.forEach((element: { id: string | undefined }) => {
            if (element.id === page.data.id && !isBlocking && !isBlockedBy) setIsBlockedBy(true);
          });

          props.user?.data.blocking.forEach((element: { id: string | undefined }) => {
            if (element.id === page.data.id && !isBlockedBy && !isBlocking) setIsBlocking(true);
          });
        }
      }

      page.data?.following.forEach((element: { name: any; image: any; id: any; handle: string }) => {
        if (element.name && element.image) followingArray.push({ UserID: element.id, UserName: element.name, UserHandle: element.handle, UserImage: element.image, UserFollowing: userfollowing.indexOf(element.handle) > -1 || false, UserRemoved: false });
      });

      page.data?.followers.forEach((element: { name: any; image: any; id: string; handle: string }) => {
        if (element.name && element.image) followersArray.push({ UserID: element.id, UserName: element.name, UserHandle: element.handle, UserImage: element.image, UserFollowing: userfollowing.indexOf(element.handle) > -1 || false, UserRemoved: false });
        if (element.id === session?.user?.id && !isFollowing) setIsFollowing(true);
      });

      setFollowing(followingArray);
      setFollowers(followersArray);
    }
  }, [page.data]);

  if (page.isLoading) {
    return <Spinner theme={props.theme} viewport={props.viewport} />;
  }

  if (status === "unauthenticated" ? page.isError : session?.user?.handle === String(profile) ? page.isError : page.data?.handle === String(profile) ? false : page.data?.handle !== String(profile)) return <Error error="User does not exist" session={Boolean(session)} theme={props.theme} viewport={props.viewport} />;
  if (isBlocking) return <Error error="You have blocked this user" session={Boolean(session)} theme={props.theme} viewport={props.viewport} />;
  if (isBlockedBy) return <Error error="This user has blocked you" session={Boolean(session)} theme={props.theme} viewport={props.viewport} />;

  if (!isBlockedBy && !isBlocking)
    return (
      <>
        <Head>
          <title>{`${page.data?.name} (@${page.data?.handle})	• Clonegram`}</title>
          <meta name="description" content="Clonegram by Ushira Dineth" />
          <link rel="icon" href={"/favicon.ico"} />
        </Head>
        <main>
          {followersMenu && <ListOfUsers viewport={props.viewport} users={followers} userSetter={() => setFollowers} theme={props.theme} onClickNegative={() => setFollowersMenu(false)} title="Followers" userHandle={session?.user?.handle} userID={session?.user?.id} pageID={page.data?.id ? page.data.id : "0"} />}
          {followingMenu && <ListOfUsers viewport={props.viewport} users={following} userSetter={() => setFollowing} theme={props.theme} onClickNegative={() => setFollowingMenu(false)} title="Following" userHandle={session?.user?.handle} userID={session?.user?.id} pageID={page.data?.id ? page.data.id : "0"} />}
          {options && <ProfileOptions onClickNegative={() => setOptions(false)} theme={props.theme} page={page as UserType} refetch={props.user.refetch} setIsBlocking={setIsBlocking} />}
          {!session && (
            <div className={"fixed bottom-0 left-0 flex h-12 w-screen items-center justify-center gap-2 " + props.theme.primary}>
              Sign in to Clonegram to see more!
              <button className={"rounded-full px-4 py-2 font-semibold no-underline transition " + props.theme.tertiary} onClick={() => router.push("/")}>
                Sign in
              </button>
            </div>
          )}
          <div className={" " + (props.viewport == "Web" && session && " ml-72 ") + (props.viewport == "Tab" && session && " ml-16 ")}>
            <div id="Background" className={"flex min-h-screen flex-col items-center justify-center " + props.theme.secondary}>
              <div className={"grid w-fit " + (props.viewport && " place-items-center ")}>
                <div id="user-details" className={"flex h-fit py-5 " + (props.viewport == "Mobile" && " w-[400px] ") + (props.viewport == "Web" && " w-[700px] items-center justify-center ") + (props.viewport == "Tab" && " w-[500px] items-center justify-center ")}>
                  <Image className={"rounded-full " + (props.viewport == "Mobile" ? " mr-2 ml-2 mt-4 h-24 w-24 " : " mr-10 flex w-24 scale-125 justify-center ")} src={page.data?.image ? page.data?.image : ""} height={96} width={96} alt="Profile Picture" priority />
                  <div id="headline" className={"mb-4 mt-6 ml-4 grid grid-flow-row " + (props.viewport != "Mobile" && " h-fit gap-3 ")}>
                    <div id="user-info">
                      <div className="flex items-center gap-3">
                        <div id="id" className="max-w-[200px] overflow-hidden text-ellipsis text-xl">
                          {page.data?.handle}
                        </div>
                        <button id="cta" disabled={follow.isLoading || unfollow.isLoading} className={"cursor-pointer text-xs font-semibold disabled:cursor-not-allowed " + (props.viewport === "Mobile" && " hidden ") + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => (session ? (session?.user?.id === page.data?.id ? router.push("/settings") : isFollowing ? unfollowFunc() : followFunc()) : router.push("/"))}>
                          {session?.user?.id === page.data?.id ? (
                            "Edit profile"
                          ) : follow.isLoading || unfollow.isLoading ? (
                            <svg aria-hidden="true" className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                          ) : isFollowing ? (
                            "Following"
                          ) : (
                            "Follow"
                          )}
                        </button>
                        {session?.user?.id === page.data?.id ? <IoMdSettings id="settings" className="scale-150 cursor-pointer" onClick={() => router.push("/settings")} /> : <BsThreeDots className="scale-150 cursor-pointer" onClick={() => (session ? setOptions(true) : router.push("/"))} />}
                      </div>
                    </div>
                    <button id="cta-mobile" disabled={follow.isLoading || unfollow.isLoading} className={"z-10 mt-2 flex h-fit w-[235px] cursor-pointer items-center justify-center rounded-[4px] border-2 p-2 text-xs font-semibold " + (props.viewport != "Mobile" && " hidden ") + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => (session ? (session?.user?.id === page.data?.id ? router.push("/settings") : isFollowing ? unfollowFunc() : followFunc()) : router.push("/"))}>
                      {session?.user?.id === page.data?.id ? (
                        "Edit profile"
                      ) : follow.isLoading || unfollow.isLoading ? (
                        <svg aria-hidden="true" className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                      ) : isFollowing ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </button>

                    <div id="stats" className={"grid grid-flow-col gap-2 text-sm font-normal " + (props.viewport == "Mobile" && " hidden ")}>
                      <div className="flex gap-1">
                        <p className="font-semibold">{page.data?.posts.length}</p>
                        <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>posts</p>
                      </div>
                      <div className="flex cursor-pointer gap-1" onClick={() => (session ? setFollowersMenu(true) : router.push("/"))}>
                        <p className="font-semibold">{page.data?.followers.length}</p>
                        <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>followers</p>
                      </div>
                      <div className="flex cursor-pointer gap-1" onClick={() => (session ? setFollowingMenu(true) : router.push("/"))}>
                        <p className="font-semibold">{page.data?.following.length}</p>
                        <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>following</p>
                      </div>
                    </div>
                    <div id="details" className={"text-sm font-semibold " + (props.viewport == "Mobile" && " hidden ")}>
                      <div id="name">{page.data?.name}</div>
                      <div id="bio" className={"mr-2 grid w-72 grid-flow-col break-all " + (page.data?.bio ? "" : " hidden ")}>
                        {page.data?.bio}
                      </div>
                    </div>
                  </div>
                </div>
                <div id="details-mobile" className={"mb-5 w-[460px] px-8 text-sm font-semibold " + (props.viewport != "Mobile" && " hidden ")}>
                  <div id="name" className="">
                    {page.data?.name}
                  </div>
                  <div id="bio" className={"grid grid-flow-col break-all " + (page.data?.bio ? "" : " hidden ")}>
                    {page.data?.bio}
                  </div>
                </div>
                <div id="stats-mobile" className={"z-10 grid w-screen grid-flow-col place-items-center border-y border-gray-500 py-2 text-sm font-normal " + (props.viewport != "Mobile" && " hidden ")}>
                  <div className="grid place-items-center">
                    <p className="font-semibold">{page.data?.posts.length}</p>
                    <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>posts</p>
                  </div>
                  <div className="grid cursor-pointer place-items-center" onClick={() => (session ? setFollowersMenu(true) : router.push("/"))}>
                    <p className="font-semibold">{page.data?.followers.length}</p>
                    <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>followers</p>
                  </div>
                  <div className="grid cursor-pointer place-items-center" onClick={() => (session ? setFollowingMenu(true) : router.push("/"))}>
                    <p className="font-semibold">{page.data?.following.length}</p>
                    <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>following</p>
                  </div>
                </div>
                <div id="posts" className={"grid grid-cols-3 place-items-center py-10 " + (props.viewport == "Mobile" && " gap-2 ") + (props.viewport == "Web" && " w-[832px] gap-4 border-t border-gray-500 px-24 ") + (props.viewport == "Tab" && " w-[600px] border-t border-gray-500 ")}>
                  {page.data?.posts.length && page.data?.posts.length > 0 ? (
                    <div className={"flex items-center justify-center " + (props.viewport == "Mobile" && " h-36 w-36 ") + (props.viewport == "Web" && " h-52 w-52 ") + (props.viewport == "Tab" && " m-2 mb-0 h-48 w-48 ")} />
                  ) : (
                    <div className={"col-span-3 flex items-center justify-center " + (props.viewport == "Mobile" ? " h-[392px] w-[392px] " : " h-[624px] w-full ")}>
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-2">
                          <FiCamera className="scale-x-[-5] scale-y-[5] transform" />
                        </div>
                        <div className="text-xl">No posts yet</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
};

export default Profile;
