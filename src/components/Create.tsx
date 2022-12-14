import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface itemType {
  create: boolean;
  setCreate: (params: any) => any;
  hook: JSX.Element;
  setActive: (params: any) => any;
}

const Create = (props: itemType) => {
  if (props.create)
    return (
      <div className="h-full w-screen">
        <div
          className="fixed top-8 right-8 scale-150 hover:cursor-pointer"
          onClick={() => {
            props.setCreate(false);
            props.setActive(props.hook.type.name);
          }}
        >
          <AiOutlineClose color="white" />
        </div>
        <div className="absolute top-1/2 left-1/2 transition-all duration-700 h-[500px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[700px] lg:w-[700px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white">
          <div className="flex h-12 w-full items-center justify-center border-b-[1px] border-black font-semibold">Create new post</div>
          <div className="flex h-[93.7%] items-center justify-center">
            <div className="grid place-items-center gap-4">
              <svg aria-hidden="true" viewBox="0 0 36.129 36.129" className="h-52" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M30.32,7.163H1.811C0.812,7.163,0,7.974,0,8.975V31.15c0,0.998,0.812,1.811,1.811,1.811H30.32c1,0,1.812-0.812,1.812-1.811
		V8.974C32.129,7.972,31.32,7.163,30.32,7.163z M28.51,10.784v16.323l-4.141-5.026c-0.152-0.185-0.422-0.218-0.615-0.076
		l-4.816,3.517l-8.27-8.045c-0.096-0.094-0.229-0.135-0.358-0.127c-0.134,0.012-0.253,0.083-0.329,0.191l-6.359,9.099V10.784H28.51
		L28.51,10.784z M17.65,17.573c0-1.623,1.319-2.943,2.94-2.943c1.623,0,2.941,1.32,2.941,2.943c0,1.619-1.318,2.941-2.941,2.941
		C18.969,20.514,17.65,19.191,17.65,17.573z M34.771,26.396c-0.75,0-1.356-0.608-1.356-1.356V5.88H5.206
		c-0.75,0-1.357-0.606-1.357-1.356c0-0.749,0.607-1.356,1.357-1.356h29.565c0.75,0,1.357,0.607,1.357,1.356v20.517
		C36.129,25.788,35.521,26.396,34.771,26.396z"
                />
              </svg>
              <p className="text-xl font-light">Drag photos and videos here</p>
              <div className="flex w-[70%] items-center justify-center rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white">Select From Computer</div>
            </div>
          </div>
        </div>
      </div>
    );
  return <></>;
};

export default Create;
