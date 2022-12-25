import React from "react";
import Layout from "../components/Layout";

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-96 w-96  bg-black text-white flex items-center justify-center">Home</div>
      <Layout />
    </div>
  );
};

export default Home;
