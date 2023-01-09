import React, { useState, useRef, type ChangeEvent, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { trpc } from "../utils/trpc";
import { env } from "../env/client.mjs";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { DataContext } from "../pages/_app";
import InputBox from "./InputBox";
import { FcCheckmark, FcCancel } from "react-icons/fc";

const EditProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>();
  const [imageURL, setImageURL] = useState<File>();
  const [edited, setEdited] = useState(false);
  const data = useContext(DataContext);
  const [isHandleUnique, setIsHandleUnique] = useState(true);
  const [handle, setHandle] = useState(data?.user?.data.handle);

  const updateUser = trpc.user.updateUser.useMutation({
    onSuccess: async (result) => {
      data?.user?.refetch();
      router.push({ pathname: result.handle, query: { user: "true" } });
    },
  });

  const checkIfHandleUnique = trpc.user.checkIfHandleUnique.useMutation({
    onSuccess: (d) => {
      setIsHandleUnique(!Boolean(d));
      if (handle) setEdited(handle !== data?.user?.data.handle && handle?.length > 5 && (handle?.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) ? false : true));
    },
  });

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner />;

  const handleUploadClick = () => {
    imageRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setEdited(true);
    setImage(e.target.files[0]);
  };

  const onSave = async () => {
    const Name = (document.getElementById("Name") as HTMLInputElement).value;
    const Handle = (document.getElementById("Handle") as HTMLInputElement).value;
    const Bio = (document.getElementById("Bio") as HTMLInputElement).value;
    let Image;

    if (Name !== data?.user?.data.name || Handle !== data?.user?.data.handle || (data?.user?.data.bio ? Bio !== data?.user?.data.bio : Bio !== "") || typeof image !== "undefined") {
      if (typeof image !== "undefined") {
        const upload = await data?.supabase.storage.from("clonegram").upload(`/Users/${data?.user?.data.id}/ProfilePicture`, imageURL, {
          cacheControl: "1",
          upsert: true,
        });

        Image = `${env.NEXT_PUBLIC_SUPABASE_IMAGE_URL}Users/${data?.user?.data.id}/ProfilePicture`;
      }

      updateUser.mutate({ id: session.user?.id || "", name: Name, handle: Handle, bio: { text: Bio, changed: Bio !== data?.user?.data.bio }, image: Image });
    }
  };

  useEffect(() => {
    var img = new (Image as any)();
    img.src = image ? URL.createObjectURL(image) : data?.user?.data.image;
    img.onload = async function () {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = 240;
      canvas.height = 240;
      ctx?.drawImage(img, 0, 0, 240, 240);
      const blob = await (await fetch(canvas.toDataURL("image/jpeg"))).blob();
      const file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
      setImageURL(file);
    };
    img.setAttribute("crossorigin", "anonymous");
  }, [image]);

  if (typeof document !== "undefined" || typeof window !== "undefined") {
    (document.getElementById("Handle") as HTMLInputElement) &&
      (document.getElementById("Handle") as HTMLInputElement).addEventListener("keyup", () => {
        clearTimeout(0);
        setEdited(false);
        if ((document.getElementById("Handle") as HTMLInputElement).value) {
          setTimeout(() => setHandle((document.getElementById("Handle") as HTMLInputElement).value), 1000);
        }
      });
  }

  useEffect(() => {
    const reservedPaths = ["tos", "about", "post", "home", "settings"];
    if (handle !== data?.user?.data.handle && handle) {
      if (reservedPaths.includes(handle)) {
        setIsHandleUnique(false);
      } else {
        checkIfHandleUnique.mutate({ key: handle });
      }
    }
  }, [handle]);

  const handleAction = () => {
    if (handle) return data?.user?.data.handle === handle || handle.length < 6 ? <></> : isHandleUnique && !handle?.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) ? <FcCheckmark /> : <FcCancel />;
  };

  return (
    <div>
      <div className="grid grid-flow-col">
        <div className="ml-6 grid w-fit grid-flow-col place-items-center"></div>
      </div>
      <div className="grid grid-flow-row place-items-center font-semibold">
        <div className="my-4 mb-8 grid w-fit grid-flow-col place-items-start gap-8">
          <div className="grid grid-flow-row place-items-end">
            <div className="mt-2 h-12 w-12 rounded-full">{imageURL && <NextImage className={"rounded-full"} src={URL.createObjectURL(imageURL)} height={48} width={48} alt="Profile Picture" />}</div>
            <p className="mt-[36px]">Name</p>
            <p className="mt-[26px]">Handle</p>
            <p className="mt-[28px]">Bio</p>
          </div>
          <div className="mt-2 grid w-72 grid-flow-row gap-4 font-semibold text-black">
            <input type="file" accept=".png, .jpg, .jpeg" ref={imageRef} onChange={handleFileChange} style={{ display: "none" }} />
            <div className="mb-4 h-fit w-fit">
              <div id="user-handle" className="text-white">
                {data?.user?.data.handle}
              </div>
              <button className="cursor-pointer text-sm text-blue-400" onClick={handleUploadClick}>
                Change profile picture
              </button>
            </div>
            <InputBox id="Name" maxlength={50} minlength={1} placeholder="Name" onChange={(e: any) => setEdited(e.target.value !== data?.user?.data.name)} defaultValue={data?.user?.data.name || ""} />
            <InputBox id="Handle" maxlength={50} minlength={6} placeholder="Handle" onChange={(e: any) => setEdited(!isHandleUnique || checkIfHandleUnique.isLoading || e.target.value === data?.user?.data.handle)} defaultValue={data?.user?.data.handle || ""} action={handleAction()} />
            <InputBox id="Bio" maxlength={150} placeholder="Bio" onChange={(e: any) => setEdited(e.target.value !== data?.user?.data.bio)} defaultValue={data?.user?.data.bio || ""} />
            <button disabled={!edited || checkIfHandleUnique.isLoading} id="Submit" className={"mt-2 flex h-12 w-[50%] cursor-pointer items-center justify-center rounded-2xl disabled:cursor-not-allowed disabled:bg-zinc-400 " + (updateUser.isError && " bg-red-400 ") + " bg-blue-400 "} onClick={() => (updateUser.isLoading || checkIfHandleUnique.isLoading ? {} : (updateUser.isIdle || edited) && onSave())}>
              {updateUser.isLoading || checkIfHandleUnique.isLoading ? <Spinner SpinnerOnly={true} /> : <p>Submit</p>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
