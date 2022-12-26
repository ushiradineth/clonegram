import { useState } from "react";
import Image from "next/image";

interface itemType {
  Icon: JSX.Element | string | null | undefined;
  IconOnClick?: JSX.Element;
  Text?: string;
  ID: string;
  active: string;
  setActive: (params: any) => any;
  onClickHandler?: () => any;
  viewport: string;
  theme: {
    type: string,
    primary: string,
    secondary: string,
    tertiary: string,
    accent: string
  };
}

const NavBarItem = (props: itemType) => {
  const [click, setClick] = useState(false);
  const [hover, setHover] = useState(false); 

  return (
    <div
      id={props.ID}
      className={"flex cursor-pointer items-center justify-start p-2 hover:rounded-full hover:bg-gray-100 active:bg-gray-200 " + (props.viewport == "Web" && " w-64 p-2 pl-3 ")}
      onClick={() => {
        setClick(true);
        if (props.onClickHandler) {
          props.onClickHandler();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={"transition-all duration-200 " + 
      (hover ? (props.viewport == "Mobile" ? " scale-[1.6] " : " scale-110 ") : props.viewport == "Mobile" ? " scale-150 " : " scale-100 ")}>
        {typeof props.Icon === "string" ? <Image height={props.viewport == "Mobile" ? 14 : 24} width={props.viewport == "Mobile" ? 14 : 24} 
        className={"transition-all duration-200 rounded-full " +
        (hover  ? (props.viewport == "Mobile" ? " scale-[1.6] " : " scale-110 ") 
        : 
        props.viewport == "Mobile" ? " scale-150 " : " scale-100 ") + 
        (click && " border-2 border-black ")} 
        src={props.Icon} alt="Profile Picture" /> : click ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className={"ml-2 text-sm font-normal " + (props.viewport == "Web" ? " block " : " hidden ")}>{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
