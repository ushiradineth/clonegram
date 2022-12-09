import { useState } from "react";

interface itemType {
  Icon: JSX.Element;
  IconOnClick: JSX.Element;
  Text?: string;
}

const NavBarItem = (props: itemType) => {
  const [click, setClick] = useState(false);

  return (
    <div className="flex items-center justify-center" onClick={() => setClick(!click)}>
      <div className="scale-150 transition-all duration-200 hover:scale-[1.6] md:scale-100 hover:md:scale-110">{click ? props.IconOnClick : props.Icon}</div>
      {props.Text && <p className="invisible ml-2 text-sm font-normal lg:visible">{props.Text}</p>}
    </div>
  );
};

export default NavBarItem;
