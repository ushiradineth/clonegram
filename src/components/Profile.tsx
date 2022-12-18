import React, { useEffect } from "react";
import { IoMdSettings } from "react-icons/io";

interface itemType {
  viewport: string;
}

const Profile = (props: itemType) => {
  useEffect(() => {
    console.log("changed");
  }, [props.viewport]);

  return (
    <div className="grid place-items-center">
      <div id="user-details" className={"grid h-fit grid-flow-col grid-cols-12 text-white " + (props.viewport == "Mobile" ? " w-[400px] py-5 " : " w-[700px] py-5 ")}>
        <div id="profile-picture" className={"rounded-full bg-red-300 " + (props.viewport == "Mobile" ? " col-span-4 ml-2 mt-4 h-28 w-28 " : " col-start-2 col-end-4 mt-2 h-40 w-40 ")} />
        <div id="headline" className={"my-4 ml-4 grid h-36 grid-flow-row font-light " + (props.viewport == "Mobile" ? " col-span-8 " : " col-start-6 col-end-12 gap-3 ")}>
          <div id="user-info" className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div id="username" className="max-w-[200px] overflow-hidden text-ellipsis text-xl font-light">
                UsernameUsernameUsernameUsernameUsername
              </div>
              <div id="edit-profile" className={"cursor-pointer rounded-[4px] border py-1 px-2 text-xs font-semibold " + (props.viewport == "Mobile" && " hidden")}>
                Edit profile
              </div>
              <div id="settings" className="scale-150">
                <IoMdSettings />
              </div>
            </div>
          </div>
          <div id="edit-profile-mobile" className={"flex h-fit w-[235px] cursor-pointer items-center justify-center rounded-[4px] border p-2 text-xs font-semibold  " + (props.viewport != "Mobile" && " hidden ")}>
            Edit profile
          </div>
          <div id="bio-mobile" className={"hidden text-sm font-semibold " + (props.viewport == "Mobile" && " grid ")}>
            bio
          </div>
          <div id="stats" className="grid grid-flow-col gap-2 text-sm font-normal">
            <div className="flex gap-1">
              <p className="font-semibold">0</p>posts
            </div>
            <div className="flex gap-1">
              <p className="font-semibold">0</p>followers
            </div>
            <div className="flex gap-1">
              <p className="font-semibold">0</p>following
            </div>
          </div>
          <div id="bio" className={"text-sm font-semibold " + (props.viewport == "Mobile" && " hidden ")}>
            bio
          </div>
        </div>
      </div>
      <div id="posts" className={"grid grid-cols-3 place-items-center border-t-[1px] border-gray-500 py-10 " + (props.viewport == "Mobile" ? " w-[392px] gap-2 " : " w-[832px] gap-8 px-24 ")}>
        <div className={"flex items-center justify-center bg-red-300 " + (props.viewport == "Mobile" ? " h-32 w-32 " : " h-52 w-52 ")}>1</div>
        <div className={"flex items-center justify-center bg-red-300 " + (props.viewport == "Mobile" ? " h-32 w-32 " : " h-52 w-52 ")}>1</div>
        <div className={"flex items-center justify-center bg-red-300 " + (props.viewport == "Mobile" ? " h-32 w-32 " : " h-52 w-52 ")}>1</div>
        {/* <div className={"flex items-center justify-center bg-red-300 col-span-3 " + (props.mobile ? "  h-[392px] " : "   h-[624px] ")}>No posts yet</div> */}
      </div>
    </div>
  );
};

export default Profile;
