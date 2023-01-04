import { useState } from "react";
import Image from "next/image";

interface itemType {
  Icon: JSX.Element | string | null | undefined;
  IconOnClick?: JSX.Element;
  Text?: string;
  ID: string;
  onClickHandler?: () => unknown;
  viewport: string;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  active?: boolean;
}

const NavBarItem = (props: itemType) => {
  const [hover, setHover] = useState(false);

  return (
    <div id={props.ID} className={"flex cursor-pointer items-center justify-start p-2 hover:rounded-full " + (props.viewport == "Web" && " w-64 p-2 pl-3 ") + (props.theme.type === "dark" ? " hover:bg-zinc-900 text-white " : " hover:bg-zinc-200 text-black ")} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={props.onClickHandler}>
      <div className={"transition-all duration-200 " + (hover ? (props.viewport == "Mobile" ? " scale-[1.6] " : " scale-110 ") : props.viewport == "Mobile" ? " scale-150 " : " scale-100 ")}>{typeof props.Icon === "string" ? <Image height={props.viewport == "Mobile" ? 14 : 24} width={props.viewport == "Mobile" ? 14 : 24} className={"rounded-full transition-all duration-200 " + (hover ? (props.viewport == "Mobile" ? " scale-[1.6] " : " scale-110 ") : props.viewport == "Mobile" ? " scale-150 " : " scale-100 ") + (props.active && (props.theme.type === "dark" ? (props.viewport === "Mobile" ? " border-[1px] border-white " : " border-2 border-white ") : props.viewport === "Mobile" ? " border-[1px] border-black " : " border-2 border-black "))} src={props.Icon} alt="Profile Picture" /> : props.active ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className={"ml-2 text-sm font-normal " + (props.viewport == "Web" ? " block " : " hidden ")}>{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
