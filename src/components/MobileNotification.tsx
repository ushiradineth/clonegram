import React, { useContext } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import { DataContext } from "../pages/_app";
import Image from "next/image";

interface itemType {
  notification: boolean;
  setNotification: (params: any) => any;
}

const MobileNotification = (props: itemType) => {
  const router = useRouter();
  const data = useContext(DataContext);

  const NoNotifications = (props: { text: string }) => {
    return (
      <div className={"flex w-full flex-col items-center justify-center rounded-2xl p-8 " + data?.theme?.secondary}>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-4 grid h-32 w-32 place-items-center rounded-full border-4">
            <AiOutlineHeart className="scale-x-[-6] scale-y-[6] transform" />
          </div>
          <div className="text-sm">{props.text}</div>
        </div>
      </div>
    );
  };

  const NotificationContainer = (props: { element: any; index: number; setNotification: any }) => {
    const onClickHandler = (link: string) => {
      props.setNotification(false);
      router.push(link);
    };

    return (
      <div key={props.index} className="flex h-fit w-fit items-center justify-center gap-4 p-4">
        <Image onClick={() => onClickHandler("/profile/" + props.element.notificationCreator.handle)} className={"h-[50px] w-[50px] cursor-pointer rounded-full object-cover"} src={props.element.notificationCreator.image || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/default-user-image.jpg"} alt={String(props.index)} width={200} height={200} />
        <div>
          {props.element.type === "Follow" && <div>{props.element.notificationCreator.handle} has followed you</div>}
          {props.element.type === "Like" && <div>{props.element.notificationCreator.handle} has liked your post</div>}
        </div>
        {props.element.type === "Like" && <Image onClick={() => onClickHandler("/post/" + props.element.post.id)} className={"h-[50px] w-[50px] cursor-pointer rounded-2xl  object-cover"} src={props.element.post.imageURLs[0] || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/image-placeholder.png"} alt={String(props.index)} width={200} height={200} />}
      </div>
    );
  };

  return (
    <div className={"invisible fixed top-16 right-2 z-50 h-fit w-fit origin-top-right scale-95 transform rounded-lg py-1 text-sm opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 " + data?.theme?.primary}>
      <div className={"rounded-r-xl transition-all " + (props.notification ? " opacity-100 " : " opacity-0 ")}>
        <div className="grid w-full items-center border-b-[1px] font-semibold">
          <p className="my-4 ml-4 text-xl">Notifications</p>
        </div>
        <div className="flex h-fit max-h-96 flex-col items-start justify-center overflow-auto">
          {(data?.user?.data.notifications.length || 0) > 0 ? (
            data?.user?.data.notifications
              .slice(0)
              .reverse()
              .map((element, index) => <NotificationContainer element={element} index={index} key={index} setNotification={props.setNotification} />)
          ) : (
            <NoNotifications text={"No notifications yet"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNotification;
