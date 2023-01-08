import Image from "next/image";
import { DataContext } from "../pages/_app";
import { useContext } from "react";

interface itemType {
  Icon: JSX.Element | string | null | undefined;
  IconOnClick?: JSX.Element;
  Text?: string;
  ID: string;
  onClickHandler?: () => unknown;
  active?: boolean;
}

const NavBarItem = (props: itemType) => {
  const data = useContext(DataContext);

  return (
    <div id={props.ID} className={"group flex cursor-pointer items-center justify-start p-2 hover:rounded-full " + (data?.viewport == "Web" && " w-64 p-2 pl-3 ") + (data?.theme?.type === "dark" ? " text-white hover:bg-zinc-900 " : " text-black hover:bg-zinc-200 ")} onClick={props.onClickHandler}>
      <div className={"transition-all duration-200 " + (data?.viewport == "Mobile" ? " scale-150 group-hover:scale-[1.6] " : " scale-100 group-hover:scale-110 ")}>{typeof props.Icon === "string" ? <Image height={data?.viewport == "Mobile" ? 14 : 24} width={data?.viewport == "Mobile" ? 14 : 24} className={"rounded-full " + (data?.viewport === "Mobile" && " scale-[1.5] ") + (props.active && (data?.theme?.type === "dark" ? (data?.viewport === "Mobile" ? " border border-white " : " border-2 border-white ") : data?.viewport === "Mobile" ? " border border-black " : " border-2 border-black "))} src={props.Icon} alt="Profile Picture" /> : props.active ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className={"ml-2 text-sm font-normal " + (data?.viewport == "Web" ? " block " : " hidden ")}>{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
