import React, { useState, useRef, type ChangeEvent, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { trpc } from "../utils/trpc";
import { env } from "../env/client.mjs";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import { DataContext } from "../pages/_app";

const EditProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>();
  const [imageURL, setImageURL] = useState<File>();
  const [edited, setEdited] = useState(false);
  const data = useContext(DataContext);

  const updateUser = trpc.user.updateUser.useMutation({
    onSuccess: async (result) => {
      data?.user?.refetch();
      router.push({ pathname: result.handle, query: { user: "true" } });
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

  return (
    <div>
      <div className="grid grid-flow-col">
        <div className="ml-6 grid w-fit grid-flow-col place-items-center"></div>
      </div>
      <div className="grid grid-flow-row place-items-center font-semibold">
        <div className="my-4 mb-8 grid w-fit grid-flow-col place-items-start gap-8">
          <div className="grid grid-flow-row place-items-end gap-3">
            <div className="mb-4 mt-2 h-12 w-12 rounded-full">{imageURL && <NextImage className={"rounded-full"} src={URL.createObjectURL(imageURL)} height={48} width={48} alt="Profile Picture" />}</div>
            <p>Name</p>
            <p>Handle</p>
            <p>Bio</p>
          </div>
          <div className="mt-2 grid grid-flow-row gap-2 font-semibold text-black">
            <input type="file" accept=".png, .jpg, .jpeg" ref={imageRef} onChange={handleFileChange} style={{ display: "none" }} />
            <div className="mb-4 h-fit w-fit">
              <div id="user-handle" className="text-white">
                {data?.user?.data.handle}
              </div>
              <button className="cursor-pointer text-sm text-blue-400" onClick={handleUploadClick}>
                Change profile picture
              </button>
            </div>
            <input type="text" id="Name" className="border-2 pl-2" onChange={(e) => setEdited(e.target.value !== data?.user?.data.name)} defaultValue={data?.user?.data.name || ""} minLength={1} maxLength={20} />
            <input type="text" id="Handle" className="border-2 pl-2" onChange={(e) => setEdited(e.target.value !== data?.user?.data.handle)} defaultValue={data?.user?.data.handle} minLength={1} maxLength={20} />
            <input type="text" id="Bio" className="border-2 pl-2" onChange={(e) => setEdited(e.target.value !== data?.user?.data.bio)} defaultValue={data?.user?.data.bio || ""} maxLength={150} />
            <button disabled={!edited} id="Submit" className={"mt-2 flex h-12 w-[50%] cursor-pointer items-center justify-center rounded-2xl disabled:cursor-not-allowed disabled:bg-zinc-400 " + (updateUser.isError && " bg-red-400 ") + (edited && "  bg-blue-400 ")} onClick={() => onSave()}>
              {updateUser.isLoading ? (
                <svg aria-hidden="true" className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
              ) : (
                (updateUser.isIdle || edited) && <p>Submit</p>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
