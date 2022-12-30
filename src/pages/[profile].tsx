import React, { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import EditProfile from "../components/EditProfile";
import Spinner from "../components/Spinner";
import ListOfUsers from "../components/ListOfUsers";

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
}

const Profile = (props: itemType) => {
  const [editProfile, setEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersMenu, setFollowersMenu] = useState(false);
  const [followingMenu, setFollowingMenu] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const profile = router.query.profile as string;

  const followers = new Array<{ UserName: string; UserHandle: string; UserImage: string }>();
  const following = new Array<{ UserName: string; UserHandle: string; UserImage: string }>();

  const page = trpc.user.getUserByHandle.useQuery({ handle: String(profile) }, { refetchOnWindowFocus: false, retry: false });

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

  if (status === "unauthenticated") {
    router.push("/");
  }

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner viewport={props.viewport} theme={props.theme} />;

  if (session?.user?.id === page.data?.id && !router.query.user) {
    router.push({ pathname: "/" + router.query.profile, query: { user: "true" } });
  }

  if (session?.user?.id !== page.data?.id && router.query.user) {
    router.push({ pathname: "/" + router.query.profile });
  }

  if (page.isSuccess) {
    page.data.following.forEach((element) => {
      if (element.name && element.image) following.push({ UserName: element.name, UserHandle: element.handle, UserImage: element.image });
    });

    page.data.followers.forEach((element) => {
      if (element.name && element.image) followers.push({ UserName: element.name, UserHandle: element.handle, UserImage: element.image });
      if (element.id === session?.user?.id && !isFollowing) setIsFollowing(true);
    });
  }

  if (page.isError) {
    return <div className="grid h-screen w-screen place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-3xl font-light text-white">Error: User does not exist.</div>;
  }

  if (page.isLoading || page.isFetching) return <Spinner viewport={props.viewport} theme={props.theme} />;

  return (
    <div>
      {editProfile && <EditProfile viewport={props.viewport} onClickNegative={() => setEditProfile(false)} supabase={props.supabase} theme={props.theme} user={page} />}
      {followersMenu && <ListOfUsers viewport={props.viewport} users={followers} theme={props.theme} UserText="Remove" onClickNegative={() => setFollowersMenu(false)} title="Followers" />}
      {followingMenu && <ListOfUsers viewport={props.viewport} users={following} theme={props.theme} UserText="Following" onClickNegative={() => setFollowingMenu(false)} title="Following" />}
      <div className={"select-none " + (props.viewport == "Web" && " ml-72 ") + (props.viewport == "Tab" && " ml-16 ")}>
        <div id="Background" className={"flex min-h-screen flex-col items-center justify-center " + props.theme.secondary}>
          <div className={"grid w-fit " + (editProfile ? " opacity-30 " : "") + (props.viewport && " place-items-center ")}>
            <div id="user-details" className={"flex h-fit py-5 " + (props.viewport == "Mobile" && " w-[400px] ") + (props.viewport == "Web" && " w-[700px] items-center justify-center ") + (props.viewport == "Tab" && " w-[500px] items-center justify-center ")}>
              <Image className={"rounded-full " + (props.viewport == "Mobile" ? " mr-2 ml-2 mt-4 h-24 w-24 " : " mr-10 flex w-24 scale-125 justify-center ")} src={page.data?.image ? page.data?.image : ""} height={props.viewport == "Mobile" ? 96 : 160} width={props.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
              <div id="headline" className={"mb-4 mt-6 ml-4 grid grid-flow-row " + (props.viewport != "Mobile" && " h-fit gap-3 ")}>
                <div id="user-info">
                  <div className="flex items-center gap-4">
                    <div id="id" className="max-w-[200px] overflow-hidden text-ellipsis text-xl">
                      {page.data?.handle}
                    </div>
                    <div id="cta" onClick={() => (router.query.user ? setEditProfile(true) : isFollowing ? unfollowFunc() : followFunc())} className={"cursor-pointer rounded-[4px] border-2 py-1 px-2 text-xs font-semibold " + (props.viewport == "Mobile" && " hidden ")}>
                      {router.query.user ? "Edit profile" : isFollowing ? "Following" : "Follow"}
                    </div>
                    <div id="settings" className="scale-150">
                      <IoMdSettings />
                    </div>
                  </div>
                </div>
                <div id="cta-mobile" onClick={() => (router.query.user ? setEditProfile(true) : isFollowing ? unfollowFunc() : followFunc())} className={"mt-2 flex h-fit w-[235px] cursor-pointer items-center justify-center rounded-[4px] border-2 p-2 text-xs font-semibold  " + (props.viewport != "Mobile" && " hidden ")}>
                  {router.query.user ? "Edit profile" : isFollowing ? "Following" : "Follow"}
                </div>
                <div id="stats" className={"grid grid-flow-col gap-2 text-sm font-normal " + (props.viewport == "Mobile" && " hidden ")}>
                  <div className="flex gap-1">
                    <p className="font-semibold">{page.data?.posts.length}</p>
                    <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>posts</p>
                  </div>
                  <div className="flex cursor-pointer gap-1" onClick={() => setFollowersMenu(true)}>
                    <p className="font-semibold">{page.data?.followers.length}</p>
                    <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>followers</p>
                  </div>
                  <div className="flex cursor-pointer gap-1" onClick={() => setFollowingMenu(true)}>
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
            <div id="stats-mobile" className={"grid w-screen grid-flow-col place-items-center border-y border-gray-500 py-2 text-sm font-normal " + (props.viewport != "Mobile" && " hidden ")}>
              <div className="grid place-items-center">
                <p className="font-semibold">{page.data?.posts.length}</p>
                <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>posts</p>
              </div>
              <div className="grid cursor-pointer place-items-center" onClick={() => setFollowersMenu(true)}>
                <p className="font-semibold">{page.data?.followers.length}</p>
                <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>followers</p>
              </div>
              <div className="grid cursor-pointer place-items-center" onClick={() => setFollowingMenu(true)}>
                <p className="font-semibold">{page.data?.following.length}</p>
                <p className={props.theme.type === "dark" ? "text-gray-300" : "text-black"}>following</p>
              </div>
            </div>
            <div id="posts" className={"grid grid-cols-3 place-items-center py-10 " + (props.viewport == "Mobile" && " gap-2 ") + (props.viewport == "Web" && " w-[832px] gap-4 border-t border-gray-500 px-24 ") + (props.viewport == "Tab" && " w-[600px] border-t border-gray-500 ")}>
              {page.data?.posts.length > 0 ? (
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
