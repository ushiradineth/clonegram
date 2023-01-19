import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../pages/_app";

interface itemType {
  user: {
    userID: string;
    userName: string;
    userImage: string;
    userHandle: string;
  };
  index: number;
  onClickHandler?: any;
  onClickHandlerPost?: any;
  action?: JSX.Element;
  followState?: JSX.Element;
}

const ProfileLink = (props: itemType) => {
  const data = useContext(DataContext);

  return (
    <Link href={props.user.userHandle} onClick={(e) => e.preventDefault()} key={props.index} className={"mt-6 flex h-12 w-full items-center justify-center px-6"} passHref>
      <Image className={"w-12 cursor-pointer rounded-full"} onClick={props.onClickHandlerPost ? props.onClickHandlerPost : props.onClickHandler} src={props.user.userImage} height={data?.viewport == "Mobile" ? 96 : 160} width={data?.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
      <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={props.onClickHandlerPost ? () => undefined : props.onClickHandler}>
        <div onClick={props.onClickHandlerPost ? props.onClickHandlerPost : () => undefined}>{props.user.userHandle}</div>
        <div className="grid grid-flow-col place-items-start">
          <div className="w-fit truncate" onClick={props.onClickHandlerPost ? props.onClickHandlerPost : () => undefined}>
            {props.user.userName}
          </div>
          {props.followState && props.followState}
        </div>
      </div>
      {props.action && props.action}
    </Link>
  );
};

export default ProfileLink;
