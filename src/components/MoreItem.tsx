interface itemType {
  Icon?: JSX.Element;
  Text: string;
  onClickHandler?: (params: any) => any;
}

const MoreItem = (props: itemType) => {
  return (
    <div
      className="flex items-center border-b-2 p-2 text-sm font-normal hover:bg-gray-50 active:bg-gray-200 cursor-pointer"
      onClick={props.onClickHandler}
    >
      <p className="ml-2 w-[150px] select-none">{props.Text}</p>
      <div className="scale-150">{props.Icon}</div>
    </div>
  );
};

export default MoreItem;
