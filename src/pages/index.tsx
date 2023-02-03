import { useSession } from "next-auth/react";
import Spinner from "../components/Spinner";
import Home from "../components/Home";
import Auth from "../components/Auth";

const Index = () => {
  const { data: session, status } = useSession();

  if (status == "loading") {
    return <Spinner />;
  }

  return session ? <Home /> : <Auth />;
};

export default Index;
