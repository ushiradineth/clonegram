interface itemType {
  Text: string;
  ID: string;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  active?: string;
  setActive: any;
}

const SettingItem = (props: itemType) => {
  return (
    <div id={props.ID} className={"ml-1 flex cursor-pointer items-center justify-start p-2 " + (props.active === props.ID ? " ml-0 border-l-4 border-white hover:bg-zinc-900 " : " hover:ml-0 hover:border-l-4 hover:border-zinc-500 hover:bg-zinc-900 ")} onClick={() => props.setActive(props.ID)}>
      {<p className="ml-1 text-sm font-normal">{props.Text}</p>}
    </div>
  );
};

export default SettingItem;
