import React, { useState, useRef } from "react";
import { AiOutlineClose, AiOutlineExpand } from "react-icons/ai";
import { BiArrowBack, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { TbRectangle, TbRectangleVertical } from "react-icons/tb";
import { FiSquare } from "react-icons/fi";
import OptionMenu from "./OptionMenu";
import Image from "next/image";
import { DataContext } from "../pages/_app";
import { useContext } from "react";

interface itemType {
  create: boolean;
  setCreate: (params: unknown) => unknown;
}

const Create = (props: itemType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const files = fileList ? [...fileList] : [];
  const [discard, setDiscard] = useState(false);
  const [caption, setCaption] = useState(false);
  const [ratio, setRatio] = useState("16/9");
  const data = useContext(DataContext);

  const SelectImage = () => {
    return (
      <div className={"absolute top-1/2 left-1/2 z-30 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl transition-all duration-700 " + data?.theme?.tertiary}>
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
            <p className="select-none text-xl font-light">Add photos and videos here</p>
            <div onClick={() => inputRef.current?.click()} className="flex w-[70%] cursor-pointer items-center justify-center rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600 active:bg-blue-400">
              Select From Computer
            </div>
            <input type="file" accept=".png, .jpg, .jpeg" ref={inputRef} onChange={(e) => setFileList(e.target.files)} style={{ display: "none" }} multiple />
          </div>
        </div>
      </div>
    );
  };

  const Crop = () => {
    const [imageIndex, setImageIndex] = useState(0);

    return (
      <div className={"absolute top-1/2 left-1/2 z-30 h-[500px] w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl transition-all duration-700 " + data?.theme?.tertiary}>
        <div className="flex h-12 w-full items-center justify-center font-semibold">
          <div className="grid w-full grid-flow-col grid-cols-3 border-b-[2px] py-2">
            <div className="flex cursor-pointer items-center">
              <BiArrowBack className="z-10 ml-5 scale-150 cursor-pointer" onClick={() => setDiscard(true)} />
            </div>
            <div className="grid place-items-center">Preview</div>
            <button className="mr-5 grid place-items-end text-blue-400" onClick={() => setCaption(true)}>
              Next
            </button>
          </div>
        </div>
        <div className="flex h-[90%] items-center justify-center">
          <BiChevronLeft onClick={() => imageIndex > 0 && setImageIndex(imageIndex - 1)} className={"fixed left-4 top-[53%] scale-150 rounded-full bg-zinc-600 " + (imageIndex > 0 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <BiChevronRight onClick={() => imageIndex < files.length - 1 && setImageIndex(imageIndex + 1)} className={"fixed right-4 top-[53%] scale-150 rounded-full bg-zinc-600 " + (imageIndex < files.length - 1 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <Image src={URL.createObjectURL(files[imageIndex] || new Blob())} key="image" className="h-full w-full object-contain" height={500} width={400} alt={"images"} />
          <div className="group">
            <button type="button" aria-haspopup="true" className="fixed bottom-2 left-4 cursor-pointer rounded-full bg-black p-2 text-white shadow-[0px_0px_10px_rgba(0,0,0,0.7)] transition-all duration-300 focus-within:bg-white focus-within:text-black hover:text-gray-500 hover:shadow-[0px_0px_10px_rgba(0,0,0,0.4)]">
              <AiOutlineExpand />
            </button>
            <div className="invisible fixed bottom-12 left-4 grid origin-bottom -translate-x-2 scale-95 transform cursor-pointer grid-flow-row rounded-lg bg-black bg-opacity-70 font-semibold text-gray-400 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
              <div onClick={() => setRatio("1/1")} className={"grid grid-flow-col place-items-center gap-2 border-b-[1px] py-2 px-4 " + (ratio === "1/1" && " text-white ")}>
                1:1 <FiSquare />
              </div>
              <div onClick={() => setRatio("4/5")} className={"grid grid-flow-col place-items-center gap-2 border-b-[1px] py-2 px-4 " + (ratio === "4/5" && " text-white ")}>
                4:5 <TbRectangleVertical />
              </div>
              <div onClick={() => setRatio("16/9")} className={"grid grid-flow-col place-items-center gap-2 py-2 px-4 " + (ratio === "16/9" && " text-white ")}>
                16:9 <TbRectangle />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const upload = () => {
    const dataForm = new FormData();
    files.forEach((file, i) => dataForm.append(`file-${i}`, file, file.name));
  };

  const Caption = () => {
    return (
      <div className={"absolute top-1/2 left-1/2 z-30 h-fit w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl transition-all duration-700 " + data?.theme?.tertiary}>
        <div className="flex h-12 w-full items-center justify-center font-semibold">
          <div className="grid w-full grid-flow-col grid-cols-3 border-b-[2px] py-2">
            <div className="flex cursor-pointer items-center">
              <BiArrowBack className="z-10 ml-5 scale-150 cursor-pointer" onClick={() => setCaption(false)} />
            </div>
            <div className="grid place-items-center">Caption</div>
            <button onClick={() => upload()} className="mr-5 grid place-items-end text-blue-400">
              Share
            </button>
          </div>
        </div>
        <div className="flex mr-4">
          <div className="flex h-[90%] w-[50%] items-center justify-center">
            <Image src={URL.createObjectURL(files[0] || new Blob())} key="image" className="h-full w-full rounded-bl-2xl object-cover" height={500} width={400} alt={"image"} />
          </div>
          <div className="ml-4 mt-2 h-12">
            <div className="flex gap-2">
              <Image src={data?.user?.data.image || ""} key="image" className="h-8 w-8 rounded-full" height={100} width={100} alt={"image"} />
              {data?.user?.data.handle}
            </div>
            <input placeholder="Write a caption..." className={"h-full w-full focus:outline-none " + data?.theme?.tertiary} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-0 left-0 z-20 h-screen w-screen bg-black bg-opacity-30">
      {discard && (
        <OptionMenu
          title="Discard post?"
          description="If you leave, your edits won't be saved."
          buttonPositive="Discard"
          buttonNegative="Cancel"
          onClickPositive={() => {
            setFileList(null);
            setDiscard(false);
          }}
          onClickNegative={() => {
            setDiscard(false);
          }}
        />
      )}
      <AiOutlineClose
        className={"fixed top-8 right-8 z-50 scale-150 cursor-pointer " + (data?.theme?.type === "dark" ? " text-gray-300 hover:text-white " : " text-zinc-800 hover:text-black ")}
        onClick={() => {
          setDiscard(true);
        }}
      />
      <div>{caption ? <Caption /> : fileList ? <Crop /> : <SelectImage />}</div>
    </div>
  );
};

export default Create;
