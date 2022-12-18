import { useState, useEffect } from "react";

interface itemType {
  Icon: JSX.Element;
  IconOnClick: JSX.Element;
  Text?: string;
  ID: string;
  active: string;
  setActive: (params: any) => any;
  onClickHandler?: () => any;
  viewport: string;
}

const NavBarItem = (props: itemType) => {
  const [click, setClick] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (props.active !== props.ID || props.active !== "M-" + props.ID) {
      setClick(false);
    }
  }, [props.active]);

  useEffect(() => {
    if (click && (props.active !== props.ID || props.active !== "M-" + props.ID)) {
      props.setActive(props.ID.split("-").pop());
      // console.log("Active: " + props.active + " ID: " + props.ID);
    }
  });

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
      <div className={"transition-all duration-200 " + (hover ? (props.viewport == "Mobile" ? " scale-[1.6] " : " scale-110 ") : props.viewport == "Mobile" ? " scale-150 " : " scale-100 ")}>{click ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className={"ml-2 text-sm font-normal " + (props.viewport == "Web" ? " block " : " hidden ")}>{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
