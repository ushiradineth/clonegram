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
import themeObject from "../components/Theme";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [viewport, setViewport] = useState("");
  const [more, setMore] = useState(false);
  const [active, setActive] = useState("");
  const [create, setCreate] = useState(false);
  const [search, setSearch] = useState(false);
  const [lsTheme, setlsTheme] = useState("");
  const [theme, setTheme] = useState({ type: "", primary: "", secondary: "", tertiary: "", accent: "" });
  const router = useRouter();
  const supabase = createClient("https://" + env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);

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
        break;
    }
  }, [active, viewport]);

  useEffect(() => {
    if (lsTheme) {
      localStorage.setItem("theme", lsTheme);
      setTheme(themeObject(lsTheme));
    }
  }, [lsTheme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }
    if (localStorage.getItem("theme")) setlsTheme(localStorage.getItem("theme") || "light");
  }, []);

  return (
    <SessionProvider session={session}>
      <Layout create={create} setCreate={setCreate} viewport={viewport} active={active} setActive={setActive} search={search} more={more} setMore={setMore} supabase={supabase} theme={theme} setTheme={setTheme} lsTheme={lsTheme} setlsTheme={setlsTheme} />
      <Component {...pageProps} viewport={viewport} supabase={supabase} theme={theme} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
