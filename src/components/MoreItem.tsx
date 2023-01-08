import { DataContext } from "../pages/_app";
import { useContext } from "react";

interface itemType {
  Icon?: JSX.Element;
  Text: string;
  onClickHandler: () => any;
  last?: boolean;
  setMore: (params: any) => any;
}

const MoreItem = (props: itemType) => {
  const data = useContext(DataContext);

  return (
    <div
      className={"flex cursor-pointer items-center p-2 pr-4 text-sm font-normal " + (!props.last && " border-b-2 border-black ") + (data?.theme?.type === "dark" ? " hover:bg-zinc-800 " : " hover:bg-zinc-200 ")}
      onClick={() => {
        props.setMore(false);
        props.onClickHandler();
      }}
    >
      <p className="ml-2 w-[150px] font-semibold">{props.Text}</p>
      <div className="scale-150">{props.Icon}</div>
    </div>
  );
};

export default MoreItem;
