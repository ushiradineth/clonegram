import React, { useState, useRef, type ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { env } from "../env/client.mjs";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import OptionMenu from "./OptionMenu";

interface itemType {
  viewport: string;
  onClickNegative: (...arg: any) => any;
  supabase: any;
}

const EditProfile = (props: itemType) => {
  const { data: session } = useSession();
  const [discard, setDiscard] = useState(false);
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>();
  const updateUser = trpc.user.updateUser.useMutation({
    onSuccess: async (data) => {
      router.push(data.handle);
      props.onClickNegative();
    },
  });

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner />;

  const user = trpc.user.getUser.useQuery({ id: session.user.id }, { refetchOnWindowFocus: false });

  const handleUploadClick = () => {
    imageRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setImage(e.target.files[0]);
  };

  const onSave = async () => {
    let Image = null;
    const Name = (document.getElementById("Name") as HTMLInputElement).value;
    const Handle = (document.getElementById("Handle") as HTMLInputElement).value;
    const Bio = (document.getElementById("Bio") as HTMLInputElement).value;

    if (image) {
      const { data, error } = await props.supabase.storage.from("clonegram").upload(user.data?.id, image, {
        cacheControl: "1",
        upsert: true,
      });

      Image = env.NEXT_PUBLIC_SUPABASE_IMAGE_URL + user.data?.id;
    }

    if (Name || Handle || Bio || Image) {
      if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner />;
      updateUser.mutate({ id: session.user.id, name: Name, handle: Handle, bio: Bio, image: Image });
    }
  };

  return (
    <div className={"h-full w-full bg-black " + (props.viewport == "Tab" && " ml-16 ") + (props.viewport == "Web" && " ml-72 ")}>
      {discard && (
        <OptionMenu
          title="Discard post?"
          description="If you leave, your edits won't be saved."
          buttonPositive="Discard"
          buttonNegative="Cancel"
          onClickPositive={props.onClickNegative}
          onClickNegative={() => {
            setDiscard(false);
          }}
        />
      )}
      <div className="absolute top-1/2 left-1/2 z-[11] h-auto w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white">
        <div className="grid grid-flow-row place-items-center border-b-[1px] border-gray-300 font-semibold">
          <div className="grid grid-flow-col">
            {user.data?.image && <Image className={"m-4 h-12 w-12 rounded-full"} src={user.data?.image} height={96} width={96} alt="Profile Picture" priority />}
            <div>
              <div className="mt-4">{user.data?.handle}</div>
              <button className="mt-1 cursor-pointer text-sm font-semibold text-blue-400" onClick={handleUploadClick}>
                Change profile picture
              </button>
            </div>
          </div>
          <div className="my-4 mb-8 grid w-full grid-flow-col place-items-center">
            <div className="grid grid-flow-row place-items-end gap-3">
              <p>Name</p>
              <p>Handle</p>
              <p>Bio</p>
            </div>
            <div className="grid grid-flow-row gap-2">
              <input type="file" accept=".png, .jpg, .jpeg" ref={imageRef} onChange={handleFileChange} style={{ display: "none" }} />
              <input type="text" id="Name" className="border-2" minLength={1} maxLength={20} />
              <input type="text" id="Handle" className="border-2" minLength={1} maxLength={20} />
              <input type="text" id="Bio" className="border-2" maxLength={150} />
            </div>
          </div>
        </div>
        <div className="flex h-12 w-full cursor-pointer items-center justify-center border-b-[1px] border-gray-300 font-semibold text-blue-400" onClick={onSave}>
          <p>Save</p>
        </div>
        <div className="flex h-12 w-full cursor-pointer items-center justify-center font-semibold" onClick={() => setDiscard(true)}>
          <p>Cancel</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
