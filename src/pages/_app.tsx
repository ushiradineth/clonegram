import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { createClient } from "@supabase/supabase-js";
import { env } from "../env/client.mjs";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [viewport, setViewport] = useState("");
  const [more, setMore] = useState(false);
  const [active, setActive] = useState("");
  const [create, setCreate] = useState(false);
  const [hook, setHook] = useState(<></>);
  const [search, setSearch] = useState(false);
  const router = useRouter();
  const supabase = createClient("https://" + env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);

  useEffect(() => {
    if (active !== "Create" && active !== "More") {
      setCreate(false);
    }

    if (active !== "Search") {
      setSearch(false);
      onResize();
    }

    switch (active) {
      case "Home":
        router.push("/");
        break;
      case "Search":
        setViewport("Tab");
        setSearch(true);
        break;
      case "Create":
        setCreate(true);
        break;
      case "Profile":
        router.push("/" + session?.user?.handle);
        break;
      default:
        setHook(<></>);
        break;
    }
  }, [active, viewport]);

  const onResize = () => {
    if (document.body.clientWidth >= 1150) {
      if (active !== "Search") {
        setViewport("Web");
      } else {
        setViewport("Tab");
      }
    } else if (document.body.clientWidth >= 750) {
      setViewport("Tab");
    } else {
      setViewport("Mobile");
      setMore(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Layout create={create} setCreate={setCreate} viewport={viewport} hook={hook} active={active} setActive={setActive} search={search} more={more} setMore={setMore} supabase={supabase} />
      <Component {...pageProps} viewport={viewport} supabase={supabase} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
