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
  InputRef?: React.Ref<HTMLInputElement>;
}

const InputBox = (props: itemType) => {
  const data = useContext(DataContext);

  return (
    <div key={props.id} className={"flex h-[35px] items-center justify-start gap-2 rounded-lg px-4 " + data?.theme?.primary}>
      <input ref={props.InputRef ? props.InputRef : null} defaultValue={props.defaultValue} onChange={props.onChange} autoComplete="off" type="text" id={props.id} className={`h-full placeholder:text-gray-500 focus:outline-none ${data?.theme?.primary}`} placeholder={props.placeholder} maxLength={props.maxlength} minLength={props.minlength || 0}></input>
      {props.action && props.action}
    </div>
  );
};

export default InputBox;
