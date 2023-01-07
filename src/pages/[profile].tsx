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
import { UserType } from "../types/types";

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
    document.dispatchEvent(new Event("visibilitychange"));
  }, [router.query]);

  const follow = trpc.user.follow.useMutation({
    onSuccess: (data) => {
      setIsFollowing(true);
    },
  });

  const unfollow = trpc.user.unfollow.useMutation({
    onSuccess: (data) => {
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

        if (session?.user?.handle !== String(profile)) {
          page.data?.blocking.forEach((element: { id: string | undefined }) => {
            if (element.id === session?.user?.id && !isBlocking && !isBlockedBy) setIsBlocking(true);
          });

          page.data?.blockedby.forEach((element: { id: string | undefined }) => {
            if (element.id === session?.user?.id && !isBlockedBy && !isBlocking) setIsBlockedBy(true);
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

  if (status === "unauthenticated" ? page.isError : session?.user?.handle === String(profile) ? page.isError : page.data?.handle === String(profile) ? false : page.data?.handle !== String(profile)) return <div className={"grid h-screen place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-3xl font-light text-white " + (props.viewport == "Web" && session && " ml-72 ") + (props.viewport == "Tab" && session && " ml-16 ")}>User does not exist</div>;
  if (isBlocking) return <div className={"grid h-screen place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-3xl font-light text-white " + (props.viewport == "Web" && session && " ml-72 ") + (props.viewport == "Tab" && session && " ml-16 ")}>This user has blocked you</div>;
  if (isBlockedBy) return <div className={"grid h-screen place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-3xl font-light text-white " + (props.viewport == "Web" && session && " ml-72 ") + (props.viewport == "Tab" && session && " ml-16 ")}>You have blocked this user</div>;

  if (!isBlockedBy && !isBlocking)
    return (
      <div>
        {followersMenu && <ListOfUsers viewport={props.viewport} users={followers} userSetter={() => setFollowers} theme={props.theme} onClickNegative={() => setFollowersMenu(false)} title="Followers" userHandle={session?.user?.handle} userID={session?.user?.id} pageID={page.data?.id ? page.data.id : "0"} />}
        {followingMenu && <ListOfUsers viewport={props.viewport} users={following} userSetter={() => setFollowing} theme={props.theme} onClickNegative={() => setFollowingMenu(false)} title="Following" userHandle={session?.user?.handle} userID={session?.user?.id} pageID={page.data?.id ? page.data.id : "0"} />}
        {options && <ProfileOptions onClickNegative={() => setOptions(false)} theme={props.theme} page={page} setIsBlocking={setIsBlocking} />}
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
                    <div className={"flex items-center " + (props.viewport === "Mobile" ? " gap-3 " : " gap-2 ")}>
                      <div id="id" className="max-w-[200px] overflow-hidden text-ellipsis text-xl">
                        {page.data?.handle}
                      </div>
                      <button id="cta" onClick={() => (session ? (session?.user?.id === page.data?.id ? router.push("/settings") : isFollowing ? unfollowFunc() : followFunc()) : router.push("/"))} className={"mx-2 cursor-pointer rounded-[4px] border-2 py-1 px-2 text-xs font-semibold " + (props.viewport == "Mobile" && " hidden ")}>
                        {session?.user?.id === page.data?.id ? "Edit profile" : isFollowing ? "Following" : "Follow"}
                      </button>
                      {session?.user?.id === page.data?.id ? <IoMdSettings id="settings" className="scale-150 cursor-pointer" onClick={() => router.push("/settings")} /> : <BsThreeDots className="scale-150 cursor-pointer" onClick={() => (session ? setOptions(true) : router.push("/"))} />}
                    </div>
                  </div>
                  <div id="cta-mobile" onClick={() => (session ? (session?.user?.id === page.data?.id ? router.push("/settings") : isFollowing ? unfollowFunc() : followFunc()) : router.push("/"))} className={"z-10 mt-2 flex h-fit w-[235px] cursor-pointer items-center justify-center rounded-[4px] border-2 p-2 text-xs font-semibold  " + (props.viewport != "Mobile" && " hidden ")}>
                    {session?.user?.id === page.data?.id ? "Edit profile" : isFollowing ? "Following" : "Follow"}
                  </div>
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
      </div>
    );
};

export default Profile;
