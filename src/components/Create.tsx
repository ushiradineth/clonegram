import React, { useState, useRef, useEffect } from "react";
import { AiOutlineClose, AiOutlineExpand } from "react-icons/ai";
import { BiArrowBack, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { TbRectangle, TbRectangleVertical } from "react-icons/tb";
import { FiSquare } from "react-icons/fi";
import OptionMenu from "./OptionMenu";
import NextImage from "next/image";
import { DataContext } from "../pages/_app";
import { useContext } from "react";
import { trpc } from "../utils/trpc";
import { Cropper, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { env } from "../env/client.mjs";
import Spinner from "./Spinner";

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
  const [options, setOptions] = useState<{ ratio: number; coordinates: object }[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [ratioSetting, setRatioSetting] = useState("Original");
  const croppedImages = useRef(new Array(0));
  const imgCoordinates = useRef(new Array(0));

  const data = useContext(DataContext);
  const setPost = trpc.post.setPost.useMutation({
    onSuccess: () => {
      props.setCreate(false);
      data?.user?.refetch();
    },
  });

  useEffect(() => {
    if (options.length === files.length) return;
    const obj: { ratio: number; coordinates: object }[] = [];
    const imageArr: File[] = [];
    files.forEach((e) => {
      obj.push({ ratio: 0, coordinates: {} });
      imageArr.push(e);
    });
    croppedImages.current = imageArr;
    setOptions(obj);
  }, [fileList]);

  useEffect(() => {
    const setValue = (value: number) => {
      if (options[imageIndex]?.ratio !== value) {
        const temp = [...options];
        temp[imageIndex] = { ratio: value, coordinates: temp[imageIndex]?.coordinates || {} };
        setOptions(temp);
      }
    };

    switch (ratioSetting) {
      case "Original":
        setValue(0);
        break;
      case "16/9":
        setValue(1.77);
        break;
      case "4/5":
        setValue(0.8);
        break;
      case "1/1":
        setValue(1);
        break;
      default:
        break;
    }
  }, [ratioSetting]);

  useEffect(() => {
    if (options && options[imageIndex]) {
      switch (options[imageIndex]?.ratio) {
        case 0:
          if (ratioSetting !== "Original") setRatioSetting("Original");
          break;
        case 1.77:
          if (ratioSetting !== "16/9") setRatioSetting("16/9");
          break;
        case 0.8:
          if (ratioSetting !== "4/5") setRatioSetting("4/5");
          break;
        case 1:
          if (ratioSetting !== "1/1") setRatioSetting("1/1");
          break;
        default:
          break;
      }
    }
  }, [imageIndex]);

  const SelectImage = () => {
    return (
      <div className={"absolute top-1/2 left-1/2 z-30 h-[500px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl transition-all duration-700 " + (data?.viewport === "Mobile" ? " w-[400px] " : " w-[500px] ") + data?.theme?.tertiary}>
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
    const onInteractionEnd = async (cropper: CropperRef) => {
      const blob = await (await fetch(cropper.getCanvas()?.toDataURL() || "")).blob();
      const file = new File([blob], `${imageIndex}.jpg`, { type: "image/jpeg" });

      const temp = [...croppedImages.current];
      temp[imageIndex] = file;
      croppedImages.current = [...temp];

      imgCoordinates.current[imageIndex] = cropper.getCoordinates();
    };

    const onReady = async (cropper: CropperRef) => {
      if (!imgCoordinates.current[imageIndex]) {
        imgCoordinates.current[imageIndex] = cropper.getCoordinates();
      }
    };

    return (
      <div className={"absolute top-1/2 left-1/2 z-30 h-fit min-h-[200px] w-fit min-w-[200px] max-w-[450px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl " + data?.theme?.tertiary}>
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
        <div className="relative flex items-center justify-center transition-all duration-300">
          <BiChevronRight onClick={() => imageIndex < files.length - 1 && setImageIndex(imageIndex + 1)} className={"fixed right-4 top-[53%] z-20 ml-auto h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex < files.length - 1 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <BiChevronLeft onClick={() => imageIndex > 0 && setImageIndex(imageIndex - 1)} className={"fixed left-4 top-[53%] z-20 h-4 w-4 scale-150 rounded-full bg-zinc-600 object-contain " + (imageIndex > 0 ? " cursor-pointer hover:bg-white hover:text-zinc-600 " : " opacity-0 ")} />
          <div className={"h-full w-full rounded-b-2xl object-cover"}>
            <Cropper src={URL.createObjectURL(files[imageIndex] || new Blob())} onInteractionEnd={onInteractionEnd} onReady={onReady} className={"cropper rounded-b-2xl"} defaultCoordinates={imgCoordinates.current[imageIndex]} stencilProps={options[imageIndex]?.ratio ? { aspectRatio: options[imageIndex]?.ratio || 1 } : {}} />
          </div>
          <div className="group">
            <button type="button" aria-haspopup="true" className="fixed bottom-3 left-4 cursor-pointer rounded-full bg-black p-2 text-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transition-all duration-300 focus-within:bg-white focus-within:text-black hover:text-gray-500 hover:shadow-[0px_0px_10px_rgba(0,0,0,0.4)]">
              <AiOutlineExpand />
            </button>
            <div className="invisible fixed bottom-12 left-4 grid origin-bottom -translate-x-2 scale-95 transform cursor-pointer grid-flow-row rounded-lg bg-black bg-opacity-70 font-semibold text-gray-400 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
              <div onClick={() => setRatioSetting("Original")} className={"grid grid-flow-col place-items-center gap-2 border-b-[1px] py-2 px-4 " + (ratioSetting === "Original" && " text-white ")}>
                Original
              </div>
              <div onClick={() => setRatioSetting("1/1")} className={"grid grid-flow-col place-items-center gap-2 border-b-[1px] py-2 px-4 " + (ratioSetting === "1/1" && " text-white ")}>
                1:1 <FiSquare />
              </div>
              <div onClick={() => setRatioSetting("4/5")} className={"grid grid-flow-col place-items-center gap-2 border-b-[1px] py-2 px-4 " + (ratioSetting === "4/5" && " text-white ")}>
                4:5 <TbRectangleVertical />
              </div>
              <div onClick={() => setRatioSetting("16/9")} className={"grid grid-flow-col place-items-center gap-2 py-2 px-4 " + (ratioSetting === "16/9" && " text-white ")}>
                16:9 <TbRectangle />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const upload = () => {
    if (!options) return;
    const Links: string[] = [];

    croppedImages.current.forEach(async (element, index) => {
      Links.push(`${env.NEXT_PUBLIC_SUPABASE_IMAGE_URL}Users/${data?.user?.data.id}/Posts/${(Number(data?.user?.data.posts.length) || 0) + 1}/${index}`);
      await data?.supabase.storage.from("clonegram").upload(`/Users/${data?.user?.data.id}/Posts/${(Number(data?.user?.data.posts.length) || 0) + 1}/${index}`, element, {
        cacheControl: "1",
        upsert: true,
      });
    });

    if (Links.length === croppedImages.current.length) setPost.mutate({ id: data?.user?.data.id || "", links: Links, caption: (document.getElementById("post-caption") as HTMLInputElement).value || null });
  };

  const Caption = () => {
    return (
      <div className={"absolute top-1/2 left-1/2 z-30 h-fit min-h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl " + data?.theme?.tertiary}>
        <div className="flex h-12 w-full items-center justify-center font-semibold">
          <div className="grid w-full grid-flow-col grid-cols-3 border-b-[2px] py-2">
            <div className="flex cursor-pointer items-center">
              <BiArrowBack className="z-10 ml-5 scale-150 cursor-pointer" onClick={() => setCaption(false)} />
            </div>
            <div className="grid place-items-center">Caption</div>
            <button id="Log out" className="flex h-8 w-full cursor-pointer items-center justify-end pr-5 text-blue-400" onClick={() => upload()}>
              {setPost.isLoading ? <Spinner SpinnerOnly={true} fill={"fill-blue-300"} /> : "Share"}
            </button>
          </div>
        </div>
        <div className="mt-[1px] flex h-fit min-h-[151px]">
          <div className="w-[50%]">
            <NextImage src={URL.createObjectURL(files[0] || new Blob())} key="image" className="h-full w-full rounded-bl-2xl object-cover" height={500} width={400} alt={"image"} />
          </div>
          <div className="m-4 w-[50%]">
            <div className="flex gap-2 truncate">
              <NextImage src={data?.user?.data.image || "https://hmgdlvdpchcrxwiqomud.supabase.co/storage/v1/object/public/clonegram/Assets/image-placeholder.png"} key="image" className="h-8 w-8 rounded-full" height={100} width={100} alt={"image"} />
              {data?.user?.data.handle}
            </div>
            <textarea id="post-caption" placeholder="Write a caption..." maxLength={500} className={"min-h-24 mt-4 w-full rounded-xl p-2 focus:outline-none " + data?.theme?.secondary} />
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
            setCaption(false);
            setFileList(null);
            setDiscard(false);
            setImageIndex(0);
            setOptions([]);
            setRatioSetting("Original");
            croppedImages.current = [];
            imgCoordinates.current = [];
          }}
          onClickNegative={() => {
            setDiscard(false);
          }}
        />
      )}
      <AiOutlineClose
        className={"fixed top-8 right-8 z-50 scale-150 cursor-pointer " + (data?.theme?.type === "dark" ? " text-gray-300 hover:text-white " : " text-zinc-800 hover:text-black ")}
        onClick={() => {
          fileList ? setDiscard(true) : props.setCreate(false);
        }}
      />
      <div>{caption ? <Caption /> : fileList ? <Crop /> : <SelectImage />}</div>
    </div>
  );
};

export default Create;
