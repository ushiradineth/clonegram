import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

interface itemType {
  search: boolean;
  mobile: boolean;
}

const Search = (props: itemType) => {
  return (
    <>
      <div className={"fixed top-0 left-16 h-screen rounded-r-xl bg-white shadow-[25px_0px_50px_rgba(0,0,0,0.1)] transition-all duration-1000 z-10 " + (props.search ? " w-[350px] border-l-2 " : " w-0 ") + (props.mobile && " hidden ")}>
        <div className={"rounded-r-xl bg-white opacity-0 transition-all " + (props.search && " opacity-100 ")}>
          <div className={"h-screen transition-all duration-200"}>
            <div className="grid w-full items-center border-b-[1px] font-semibold">
              <p className="mt-4 ml-4 text-xl select-none">Search</p>
              <div className="my-4 ml-4 flex h-[30px] w-[90%] items-center rounded-lg bg-gray-200">
                <p className="ml-[12px] w-[88%] text-sm text-gray-500 select-none">Search</p>
                <div className="">
                  <AiFillCloseCircle color="gray" />
                </div>
              </div>
            </div>
            <p className="mt-4 ml-4 text-lg select-none">Recent</p>
            <div className={"flex h-[80%] items-center justify-center"}>
              <p className="text-sm text-gray-500 select-none ">No recent searches.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
