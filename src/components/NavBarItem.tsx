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
  return (
    <div id={props.ID} className={"group flex cursor-pointer items-center justify-start p-2 hover:rounded-full " + (props.viewport == "Web" && " w-64 p-2 pl-3 ") + (props.theme.type === "dark" ? " text-white hover:bg-zinc-900 " : " text-black hover:bg-zinc-200 ")} onClick={props.onClickHandler}>
      <div className={"transition-all duration-200 " + (props.viewport == "Mobile" ? " scale-150 group-hover:scale-[1.6] " : " scale-100 group-hover:scale-110 ")}>{typeof props.Icon === "string" ? <Image height={props.viewport == "Mobile" ? 14 : 24} width={props.viewport == "Mobile" ? 14 : 24} className={"rounded-full " + (props.viewport === "Mobile" && " scale-[1.5] ") + (props.active && (props.theme.type === "dark" ? (props.viewport === "Mobile" ? " border border-white " : " border-2 border-white ") : props.viewport === "Mobile" ? " border border-black " : " border-2 border-black "))} src={props.Icon} alt="Profile Picture" /> : props.active ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className={"ml-2 text-sm font-normal " + (props.viewport == "Web" ? " block " : " hidden ")}>{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
