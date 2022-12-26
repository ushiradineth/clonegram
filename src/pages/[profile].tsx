import React, { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import EditProfile from "../components/EditProfile";
import Spinner from "../components/Spinner";

interface itemType {
  viewport: string;
  supabase: any;
}

const Profile = (props: itemType) => {
  const [editProfile, setEditProfile] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const profile = router.query.profile as string;
  const user = trpc.user.getUserByHandle.useQuery({ handle: String(profile) }, { refetchOnWindowFocus: false, retry: false });
  const follow = trpc.user.follow.useMutation({
    onSuccess: async (data) => {
      router.push(data.q2.id);
    },
  });
  const unfollow = trpc.user.unfollow.useMutation({
    onSuccess: async (data) => {
      router.push(data.q2.id);
    },
  });

  useEffect(() => {
    setIsUser(user.data?.handle === session?.user?.handle);
    user.data?.following.forEach((element) => {
      if (element.id === session?.user?.id) {
        setIsFollowing(true);
      }
    });
  }, []);

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner />;

  const unfollowFunc = () => {
    if (session?.user?.id && user.data?.id) {
      unfollow.mutate({ userid: session?.user?.id, pageid: user.data?.id });
    }
    setIsFollowing(false);
  };

  const followFunc = () => {
    if (session?.user?.id && user.data?.id) {
      follow.mutate({ userid: session.user?.id, pageid: user.data?.id });
    }
    setIsFollowing(true);
  };

  if (user.isSuccess) {
    return (
      <>
        <div className={"select-none " + (props.viewport == "Web" && " ml-72 ") + (props.viewport == "Tab" && " ml-16 ")}>
          <div id="Background" className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] ">
            <div className={" min-h-screen " /*+ (viewport == "Web" && "  288px ml-72 ")*/}>
              {editProfile && (
                <EditProfile
                  viewport={props.viewport}
                  onClickNegative={() => {
                    setEditProfile(false);
                  }}
                  supabase={props.supabase}
                />
              )}
              <div className={"grid w-fit text-white " + (editProfile ? " opacity-30 " : "") + (props.viewport && " place-items-center ")}>
                <div id="user-details" className={"flex h-fit items-center justify-center py-5 " + (props.viewport == "Mobile" && " w-[400px] ") + (props.viewport == "Web" && " w-[700px] ") + (props.viewport == "Tab" && " w-[500px] ")}>
                  <div className="flex items-center justify-center pr-10 ">{user.data?.image ? <Image className={"rounded-full " + (props.viewport == "Mobile" ? " ml-4 mt-4 h-24 w-24 " : " flex w-24 scale-125 justify-center ")} src={user.data?.image} height={props.viewport == "Mobile" ? 96 : 160} width={props.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority /> : <div id="profile-picture" className={"rounded-full bg-red-300 " + (props.viewport == "Mobile" ? " col-span-4 ml-4 mt-4 h-24 w-24 " : " col-start-2 col-end-4 mt-2 h-40 w-40 ")} />}</div>
                  <div id="headline" className={"mb-4 mt-6 ml-4 grid grid-flow-row font-light " + (props.viewport != "Mobile" && " h-fit gap-3 ")}>
                    <div id="user-info" className="cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div id="id" className="max-w-[200px] overflow-hidden text-ellipsis text-xl font-light">
                          {user.data?.handle}
                        </div>
                        <div
                          id="cta"
                          onClick={() => {
                            isUser ? setEditProfile(true) : isFollowing ? unfollowFunc() : followFunc();
                          }}
                          className={"cursor-pointer rounded-[4px] border py-1 px-2 text-xs font-semibold " + (props.viewport == "Mobile" && " hidden ") + (props.viewport == "Tab" && " flex w-[78px] ")}
                        >
                          {isUser ? "Edit profile" : isFollowing ? "Following" : "Follow"}
                        </div>
                        <div id="settings" className="scale-150">
                          <IoMdSettings />
                        </div>
                      </div>
                    </div>
                    <div id="cta-mobile" onClick={() => setEditProfile(true)} className={"mt-2 flex h-fit w-[235px] cursor-pointer items-center justify-center rounded-[4px] border p-2 text-xs font-semibold  " + (props.viewport != "Mobile" && " hidden ") + (!isUser && " hidden ")}>
                      Edit profile
                    </div>
                    <div id="stats" className={"grid grid-flow-col gap-2 text-sm font-normal " + (props.viewport == "Mobile" && " hidden ")}>
                      <div className="flex gap-1">
                        <p className="font-semibold">{user.data?.posts.length}</p>posts
                      </div>
                      <div className="flex gap-1">
                        <p className="font-semibold">{user.data?.followers.length}</p>followers
                      </div>
                      <div className="flex gap-1">
                        <p className="font-semibold">{user.data?.following.length}</p>following
                      </div>
                    </div>
                    <div id="details" className={"text-sm font-semibold " + (props.viewport == "Mobile" && " hidden ")}>
                      <div id="name" className="">
                        {user.data?.name}
                      </div>
                      <div id="bio" className={"mr-2 grid grid-flow-col break-all " + (user.data?.bio ? "" : " hidden ")}>
                        {user.data?.bio}
                      </div>
                    </div>
                  </div>
                </div>
                <div id="details-mobile" className={"ml-5 mb-5 text-sm font-semibold " + (props.viewport != "Mobile" && " hidden ")}>
                  <div id="name" className="">
                    {user.data?.name}
                  </div>
                  <div id="bio" className={"mr-4 grid grid-flow-col break-all " + (user.data?.bio ? "" : " hidden ")}>
                    {user.data?.bio}
                  </div>
                </div>
                <div id="stats-mobile" className={"grid w-full grid-flow-col place-items-center border-y-[1px] border-gray-500 py-2  text-sm font-normal text-white " + (props.viewport != "Mobile" && " hidden ")}>
                  <div className="grid place-items-center">
                    <p className="font-semibold">{user.data?.posts.length}</p>
                    <p className="text-gray-300">posts</p>
                  </div>
                  <div className="grid place-items-center">
                    <p className="font-semibold">{user.data?.followers.length}</p>
                    <p className="text-gray-300">followers</p>
                  </div>
                  <div className="grid place-items-center">
                    <p className="font-semibold">{user.data?.following.length}</p>
                    <p className="text-gray-300">following</p>
                  </div>
                </div>
                <div id="posts" className={"grid grid-cols-3 place-items-center py-10 text-black " + (props.viewport == "Mobile" && " gap-2 ") + (props.viewport == "Web" && " w-[832px] gap-4 border-t-[1px] border-gray-500 px-24 ") + (props.viewport == "Tab" && " w-[600px] border-t-[1px] border-gray-500 ")}>
                  {!user.data?.posts ? <div className={"flex items-center justify-center bg-red-300 " + (props.viewport == "Mobile" && " h-36 w-36 ") + (props.viewport == "Web" && " h-52 w-52 ") + (props.viewport == "Tab" && " m-2 mb-0 h-48 w-48 ")} /> : <div className={"col-span-3 flex items-center justify-center bg-red-300 " + (props.viewport == "Mobile" ? " h-[392px] w-[392px] " : " h-[624px] w-full ")}>No posts yet</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (user.isError) {
    return <div className="grid h-screen w-screen place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-3xl font-light text-white">Error: User does not exist.</div>;
  }

  return <Spinner />;
};

export default Profile;
