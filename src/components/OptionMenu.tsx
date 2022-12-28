import React from "react";

interface itemType {
  title: string;
  description: string;
  buttonPositive: string;
  buttonNegative: string;
  onClickPositive: (...arg: any) => unknown;
  onClickNegative: (...arg: any) => unknown;
}

const OptionMenu = (props: itemType) => {
  return (
      <div className="absolute top-1/2 left-1/2 z-20 h-auto w-[300px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white md:w-[400px] border-2 shadow-[0px_0px_10px_rgba(0,0,0,0.7)]">
        <div className="grid w-full grid-flow-row place-items-center border-b-[1px] border-gray-300 py-8 font-semibold">
          <p className="select-none">{props.title}</p>
          <p className="ml-2 text-sm font-normal">{props.description}</p>
        </div>
        <div
          className="flex h-12 w-full cursor-pointer items-center justify-center border-b-[1px] border-gray-300 font-semibold text-red-500"
          onClick={props.onClickPositive}
        >
          <p>{props.buttonPositive}</p>
        </div>
        <div className="flex h-12 w-full cursor-pointer items-center justify-center font-semibold" onClick={props.onClickNegative}>
          <p>{props.buttonNegative}</p>
        </div>
      </div>
  );
}

export default OptionMenu;
