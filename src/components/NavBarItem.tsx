import { useState, useEffect } from "react";

interface itemType {
  Icon: JSX.Element;
  IconOnClick: JSX.Element;
  Text?: string;
  ID: string;
  active: string;
  setActive: (params: any) => any;
  onClickHandler?: () => any;
  web: boolean;
  tab: boolean;
  mobile: boolean;
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
      className={"flex items-center justify-start " + (props.web && " w-64 p-2 pl-3 hover:rounded-full hover:bg-gray-100 ") + (props.tab && " p-2 hover:rounded-full hover:bg-gray-100 ")}
      onClick={() => {
        setClick(true);
        if (props.onClickHandler) {
          props.onClickHandler();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={"transition-all duration-200 " + (hover ? " scale-[1.6] md:scale-110 " : " scale-150 md:scale-100 ")}>{click ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className={"ml-2 text-sm font-normal " + (props.web ? " block " : " hidden ")}>{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
