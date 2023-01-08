import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";

interface itemType {
  user: any;
  setUser: (params: any) => any;
  theme: any;
  status: any;
  setStatus: (params: any) => any;
  enabled?: boolean;
}

const GetUser = (props: itemType) => {
  const { data: session, status } = useSession();
  const user = trpc.user.getUser.useQuery({ id: session?.user?.id || "" }, { enabled: status === "authenticated" && props.enabled, retry: false, refetchOnWindowFocus: false });

  useEffect(() => {
    if (user.isSuccess && props.user !== user) props.setUser(user);
    if (status !== props.status && status === "loading" && user.isLoading) props.setStatus(status);
    if (status !== props.status && status === "authenticated" && user.isSuccess) props.setStatus(status);
    if (status !== props.status && status === "unauthenticated") props.setStatus(status);
  }, [user.isSuccess, status]);

  useEffect(() => {
    if (user.isSuccess && user.isFetched && props.user != null ? props.user.data !== user.data : false) {
      props.setUser(user);
    }
  }, [user]);

  if ((status === "loading" || props.status === "loading" || user.isLoading) && props.enabled) return <Spinner />;
  return <></>;
};

export default GetUser;
