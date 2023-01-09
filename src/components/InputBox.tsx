import { useContext } from "react";
import { DataContext } from "../pages/_app";

interface itemType {
  id: string;
  placeholder: string;
  maxlength: number;
  minlength?: number;
  action?: JSX.Element;
  defaultValue?: string;
  onChange?: any;
}

const InputBox = (props: itemType) => {
  const data = useContext(DataContext);

  return (
    <div key={props.id} className={"flex h-[35px] items-center justify-start px-4 gap-2 rounded-lg " + data?.theme?.tertiary}>
      <input defaultValue={props.defaultValue} onChange={props.onChange} autoComplete="off" type="text" id={props.id} className={`h-full w-full placeholder:text-gray-500 focus:outline-none ${data?.theme?.tertiary}`} placeholder={props.placeholder} maxLength={props.maxlength} minLength={props.minlength || 0}></input>
      {props.action && props.action}
    </div>
  );
};

export default InputBox;
