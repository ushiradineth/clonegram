interface itemType {
  Icon?: JSX.Element;
  Text: string;
  onClickHandler?: (params: unknown) => unknown;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  last?: boolean;
}

const MoreItem = (props: itemType) => {
  return (
    <div className={"flex cursor-pointer items-center p-2 pr-4 text-sm font-normal " + (!props.last && " border-b-2 border-black ") + ` hover:${props.theme.tertiary} `} onClick={props.onClickHandler}>
      <p className="ml-2 w-[150px] font-semibold">{props.Text}</p>
      <div className="scale-150">{props.Icon}</div>
    </div>
  );
};

export default MoreItem;
