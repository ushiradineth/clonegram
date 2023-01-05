import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import OptionMenu from "./OptionMenu";

interface itemType {
  onClickNegative: (...arg: any) => unknown;
  theme: {
    type: string;
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  page: any;
  setIsBlocking: (...arg: any) => unknown;
}

const ProfileOptions = (props: itemType) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blockMenu, setBlockMenu] = useState(false);

  const block = trpc.user.block.useMutation({
    onSuccess: (data) => {
      props.setIsBlocking(true)
    },
  });

  const blockFunc = () => {
    if (session?.user?.id && props.page?.id) {
      block.mutate({ userid: session.user?.id, pageid: props.page?.id })
    }
  };

  return (
    <>
      {blockMenu && <OptionMenu title={`Block ${props.page.handle}?`} description="They won't be able to find your profile or posts." buttonPositive="Block" buttonNegative="Cancel" onClickPositive={blockFunc} onClickNegative={() => setBlockMenu(false)} theme={props.theme} />}
      <div className="fixed top-0 left-0 z-30 h-screen w-screen bg-black bg-opacity-30">
        <div className={"absolute top-1/2 left-1/2 z-20 h-auto w-[300px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.7)] md:w-[400px] " + props.theme.tertiary}>
          <div className="flex h-12 w-full cursor-pointer items-center justify-center border-b font-semibold text-red-500" onClick={() => setBlockMenu(true)}>
            <p>Block</p>
          </div>
          <div className="flex h-12 w-full cursor-pointer items-center justify-center font-semibold" onClick={props.onClickNegative}>
            <p>Cancel</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileOptions;
