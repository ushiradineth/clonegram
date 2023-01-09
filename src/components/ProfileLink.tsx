import Image from "next/image";
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
  onClickHandler: any;
  action?: JSX.Element;
}

const ProfileLink = (props: itemType) => {
  const data = useContext(DataContext);
  
  return (
    <a href={props.user.userHandle} onClick={(e) => e.preventDefault()} key={props.index} className={"mt-6 flex h-12 w-full px-6 items-center justify-center"}>
      <Image className={"w-12 cursor-pointer rounded-full"} onClick={props.onClickHandler} src={props.user.userImage} height={data?.viewport == "Mobile" ? 96 : 160} width={data?.viewport == "Mobile" ? 96 : 160} alt="Profile Picture" priority />
      <div className="m-4 flex w-full cursor-pointer flex-col gap-1 truncate" onClick={props.onClickHandler}>
        <div>{props.user.userHandle}</div>
        <div>{props.user.userName}</div>
      </div>
      {props.action && props.action}
    </a>
  );
};

export default ProfileLink;
