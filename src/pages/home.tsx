import { useSession } from "next-auth/react";
import router from "next/router";
import React from "react";

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  
  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex h-96  w-96 items-center justify-center bg-black text-white">Home</div>
    </div>
  );
};

export default Home;
