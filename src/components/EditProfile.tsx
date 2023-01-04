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
  onClickNegative: (...arg: any) => unknown;
  supabase: any;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  user: any;
}

const EditProfile = (props: itemType) => {
  const { data: session } = useSession();
  const [discard, setDiscard] = useState(false);
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>();
  const updateUser = trpc.user.updateUser.useMutation({
    onSuccess: async (data) => {
      data.handle === session?.user?.handle ? location.reload() : router.push({ pathname: data.handle, query: { user: "true" } });
      props.onClickNegative();
    },
  });

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner viewport={props.viewport} theme={props.theme} />;

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
    let Image;
    const Name = (document.getElementById("Name") as HTMLInputElement).value;
    const Handle = (document.getElementById("Handle") as HTMLInputElement).value;
    const Bio = (document.getElementById("Bio") as HTMLInputElement).value;

    if (Name !== props.user.name || Handle !== props.user.handle || (props.user.bio ? Bio !== props.user.bio : Bio !== "") || typeof image !== "undefined") {
      if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Spinner viewport={props.viewport} theme={props.theme} />;

      if (typeof image !== "undefined") {
        const { data, error } = await props.supabase.storage.from("clonegram").upload(props.user.id, image, {
          cacheControl: "1",
          upsert: true,
        });

        Image = env.NEXT_PUBLIC_SUPABASE_IMAGE_URL + props.user?.id;
      }

      updateUser.mutate({ id: session.user.id, name: Name, handle: Handle, bio: { text: Bio, changed: Bio !== props.user.bio }, image: Image });
    }
  };

  return (
    <div className={"fixed top-0 left-0 z-30 h-screen w-screen bg-black bg-opacity-30"}>
      {discard && <OptionMenu title="Discard post?" description="If you leave, your edits won't be saved." buttonPositive="Discard" buttonNegative="Cancel" onClickPositive={props.onClickNegative} onClickNegative={() => setDiscard(false)} theme={props.theme} />}
      <div className={"absolute top-1/2 left-1/2 h-auto w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl " + props.theme.tertiary}>
        <div className="grid grid-flow-row place-items-center border-b border-gray-300 font-semibold">
          <div className="grid grid-flow-col">
            {<Image className={"m-4 h-12 w-12 rounded-full"} src={image ? URL.createObjectURL(image) : props.user?.image} height={96} width={96} alt="Profile Picture" />}
            <div>
              <div className="mt-4">{props.user?.handle}</div>
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
            <div className="grid grid-flow-row gap-2 text-black">
              <input type="file" accept=".png, .jpg, .jpeg" ref={imageRef} onChange={handleFileChange} style={{ display: "none" }} />
              <input type="text" id="Name" className="border-2 pl-2" defaultValue={props.user.name} minLength={1} maxLength={20} />
              <input type="text" id="Handle" className="border-2 pl-2" defaultValue={props.user.handle} minLength={1} maxLength={20} />
              <input type="text" id="Bio" className="border-2 pl-2" defaultValue={props.user.bio} maxLength={150} />
            </div>
          </div>
        </div>
        <div
          className="flex h-12 w-full cursor-pointer items-center justify-center border-b border-gray-300 font-semibold text-blue-400"
          onClick={() => {
            onSave();
            props.onClickNegative();
          }}
        >
          <p>Save</p>
        </div>
        <div
          className="flex h-12 w-full cursor-pointer items-center justify-center font-semibold"
          onClick={() => {
            const Name = (document.getElementById("Name") as HTMLInputElement).value;
            const Handle = (document.getElementById("Handle") as HTMLInputElement).value;
            const Bio = (document.getElementById("Bio") as HTMLInputElement).value;

            Name !== props.user.name || Handle !== props.user.handle || (props.user.bio ? Bio !== props.user.bio : Bio !== "") || typeof image !== "undefined" ? setDiscard(true) : props.onClickNegative();
          }}
        >
          <p>Cancel</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
