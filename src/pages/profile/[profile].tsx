import React, { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
import { BsThreeDots, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { TfiLayoutGrid3, TfiLayoutGrid3Alt } from "react-icons/tfi";
import { IoMdAlbums } from "react-icons/io";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Spinner from "../../components/Spinner";
import ListOfUsers from "../../components/ListOfUsers";
import ProfileOptions from "../../components/ProfileOptions";
import Error from "../../components/Error";
import { type UserType } from "../../types/types";
import Head from "next/head";
import { DataContext } from "../_app";
import { useContext } from "react";
import UnAuthedAlert from "../../components/UnAuthedAlert";
import OptionMenu from "../../components/OptionMenu";

const Profile = () => {
  const [options, setOptions] = useState(false);
  const [isBlockedBy, setIsBlockedBy] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersMenu, setFollowersMenu] = useState(false);
  const [followingMenu, setFollowingMenu] = useState(false);
  const [unfollowMenu, setUnfollowMenu] = useState(false);
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

    document.dispatchEvent(new Event("visibilitychange"));

    if (data?.user?.data.handle === profile && router.query.saved === "true") {
      setTab("Saved");
    } else {
      setTab("Posts");
    }
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
      setUnfollowMenu(false)
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
      if (data?.user?.data.handle !== String(profile) && session) {
        data?.user?.data.blockedby.find((element) => element.id === page?.data?.id && !isBlocking && !isBlockedBy && setIsBlockedBy(true));
        data?.user?.data.blocking.find((element) => element.id === page?.data?.id && !isBlockedBy && !isBlocking && setIsBlocking(true));
      }

      page?.data?.followers.find((element) => element.id === session?.user?.id && !isFollowing && setIsFollowing(true));
    }
  }, [page?.data]);

  const ExternalMenus = () => {
    return (
      <>
        {followersMenu && <ListOfUsers users={page?.data?.followers} onClickNegative={() => setFollowersMenu(false)} title="Followers" />}
        {followingMenu && <ListOfUsers users={page?.data?.following} onClickNegative={() => setFollowingMenu(false)} title="Following" />}
        {unfollowMenu && <OptionMenu buttonPositive={"Unfollow"} buttonNegative={"Cancel"} buttonLoading={unfollow.isLoading} description={"Do you wish to unfollow this user?"} onClickPositive={() => unfollowFunc()} onClickNegative={() => setUnfollowMenu(false)} title="Unfollow" />}
        {options && <ProfileOptions onClickNegative={() => setOptions(false)} page={page as UserType} refetch={data?.user?.refetch} setIsBlocking={setIsBlocking} />}
        {!session && <UnAuthedAlert />}
      </>
    );
  };

  const Details = () => {
    return (
      <div className={"text-sm font-semibold " + (data?.viewport == "Mobile" && " hidden ")}>
        <div id="name">{page?.data?.name}</div>
        <div id="bio" className={"mr-2 grid w-72 grid-flow-col break-all " + (page?.data?.bio ? "" : " hidden ")}>
          {page?.data?.bio}
        </div>
      </div>
    );
  };

  const DetailsMobile = () => {
    return (
      <div className={"w-full text-sm font-semibold " + (data?.viewport != "Mobile" && " hidden ")}>
        <div id="name">{page?.data?.name}</div>
        <div id="bio" className={"mt-5 grid grid-flow-col break-all " + (page?.data?.bio ? "" : " hidden ")}>
          {page?.data?.bio}
        </div>
      </div>
    );
  };

  const Stats = () => {
    return (
      <div className={"grid grid-flow-col gap-2 text-sm font-normal  " + (data?.viewport == "Mobile" && " hidden ")}>
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
    );
  };

  const StatsMobile = () => {
    return (
      <div className={"z-10 grid w-full grid-flow-col place-items-center border-y border-zinc-700 py-2 text-sm font-normal " + (data?.viewport != "Mobile" && " hidden ")}>
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
    );
  };

  const UserInfo = () => {
    const CTA = () => {
      return (
        <button disabled={follow.isLoading || unfollow.isLoading} className={"text-xs font-semibold disabled:cursor-not-allowed " + (data?.viewport === "Mobile" && " hidden ") + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border py-1 px-2 ")} onClick={() => (session ? (session?.user?.id === page?.data?.id ? router.push("/settings") : isFollowing ? setUnfollowMenu(true) : followFunc()) : router.push("/"))}>
          {session?.user?.id === page?.data?.id ? "Edit profile" : follow.isLoading || unfollow.isLoading ? <Spinner SpinnerOnly={true} /> : isFollowing ? "Following" : "Follow"}
        </button>
      );
    };

    return (
      <div>
        <div className="flex items-center gap-3">
          <div id="id" className="max-w-[150px] overflow-hidden truncate text-ellipsis text-xl sm:max-w-[500px]">
            {page?.data?.handle}
          </div>
          <CTA />
          {session?.user?.id === page?.data?.id ? <IoMdSettings id="settings" className="scale-150 cursor-pointer" onClick={() => router.push("/settings")} /> : <BsThreeDots className="scale-150 cursor-pointer" onClick={() => (session ? setOptions(true) : router.push("/"))} />}
        </div>
      </div>
    );
  };

  const CTAMobile = () => {
    return (
      <button disabled={follow.isLoading || unfollow.isLoading} className={"z-10 mt-2 flex h-fit w-full items-center justify-center p-2 text-xs font-semibold disabled:cursor-not-allowed " + (data?.viewport != "Mobile" && " hidden ") + (follow.isLoading || unfollow.isLoading ? " " : " rounded-[4px] border-2 py-1 px-2 ")} onClick={() => (session ? (session?.user?.id === page?.data?.id ? router.push("/settings") : isFollowing ? setUnfollowMenu(true) : followFunc()) : router.push("/"))}>
        {session?.user?.id === page?.data?.id ? "Edit profile" : follow.isLoading || unfollow.isLoading ? <Spinner SpinnerOnly={true} /> : isFollowing ? "Following" : "Follow"}
      </button>
    );
  };

  function PostView() {
    const SelectionTab = () => {
      return (
        <div className={"flex h-12 max-w-[908px] items-center justify-center gap-2 " + (data?.user?.data.handle !== page?.data?.handle ? " hidden " : "") + (data?.viewport === "Mobile" ? " w-full border-b " : " w-full border-t ")}>
          <div onClick={() => setTab("Posts")} className={"z-10 flex h-full cursor-pointer items-center justify-center gap-2 px-2 active:text-zinc-700 " + (tab === "Posts" && "  border-y ")}>
            {tab === "Posts" ? <TfiLayoutGrid3Alt /> : <TfiLayoutGrid3 />} Posts
          </div>
          <div onClick={() => setTab("Saved")} className={"z-10 flex h-full cursor-pointer items-center justify-center gap-2 px-2 active:text-zinc-700 " + (tab === "Saved" && "  border-y ")}>
            {tab === "Saved" ? <BsBookmarkFill /> : <BsBookmark />} Saved
          </div>
        </div>
      );
    };

    return (
      <>
        <SelectionTab />
        <div className={"flex h-fit min-h-screen w-fit items-start justify-center " + (data?.viewport !== "Mobile" && " max-w-[908px] border-t ")}>
          <div className={"col-span-3 mt-1 grid grid-cols-3 place-items-center gap-1 " + (data?.viewport == "Mobile" && " mb-10 ")}>
            {(tab === "Posts" ? page?.data?.posts.length : data?.user?.data.saved.length) ? (
              (tab === "Posts" ? page?.data?.posts : data?.user?.data.saved)
                ?.slice(0)
                .reverse()
                .map((element, index) =>
                  Boolean(data?.user?.data.blocking.find((e) => e.id === element.userId)) || Boolean(data?.user?.data.blocking.find((e) => e.id === element.userId)) ? (
                    <div key={index}></div>
                  ) : (
                    <div key={index} className={"relative h-fit w-fit"}>
                      {element.imageURLs.length > 1 && <IoMdAlbums className=" absolute right-[4%] top-[4%] h-[8%] w-[8%] max-w-[30px] rotate-180 shadow-sm text-white" />}
                      <Image src={element.imageURLs[0] || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/image-placeholder.png"} height={500} width={500} onClick={() => router.push("/post/" + element.id)} alt={element.id} key={index} className={"z-10 aspect-1 h-full max-h-[300px] w-full max-w-[300px] cursor-pointer object-cover "}></Image>
                    </div>
                  )
                )
            ) : (
              <div className="min-w-screen col-span-3 mt-8 flex h-full min-h-screen w-full flex-col items-center">
                <>
                  <div className="w-screen"></div>
                  <div className="mb-4 mt-8 grid h-32 w-32 place-items-center rounded-full border-2">
                    <FiCamera className="scale-x-[-5] scale-y-[5] transform" />
                  </div>
                  <div className="text-xl">No posts yet</div>
                </>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

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
          <ExternalMenus />
          <div className={" " + (data?.viewport == "Web" && session && " ml-72 ") + (data?.viewport == "Tab" && session && " ml-16 ")}>
            <div id="Background" className={"flex h-fit select-none flex-col items-center " + data?.theme?.secondary}>
              <div className="mt-8 grid w-fit place-items-center">
                <div className="mx-2 my-6 flex h-fit flex-col items-center justify-center gap-4 md:gap-8">
                  <div className="flex items-center justify-center">
                    <Image className="h-14 w-14 rounded-full xsm:h-24 xsm:w-24 md:h-32 md:w-32" src={page?.data?.image || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/default-user-image.jpg"} height={200} width={200} alt="Profile Picture" priority />
                    <div className={"mb-4 mt-6 ml-4 grid grid-flow-row " + (data?.viewport != "Mobile" && " h-fit gap-3 ")}>
                      <UserInfo />
                      <CTAMobile />
                      <Stats />
                      <Details />
                    </div>
                  </div>
                  <DetailsMobile />
                </div>
                <StatsMobile />
                <PostView />
              </div>
            </div>
          </div>
        </main>
      </>
    );
};

export default Profile;
