import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { createClient } from "@supabase/supabase-js";
import { env } from "../env/client.mjs";
import themeObject from "../components/Theme";
import GetUser from "../components/GetUser";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [viewport, setViewport] = useState("");
  const [more, setMore] = useState(false);
  const [create, setCreate] = useState(false);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState(false);
  const [lsTheme, setlsTheme] = useState("");
  const [hideSideComponents, setHideSideComponents] = useState(false);
  const [theme, setTheme] = useState({ type: "", primary: "", secondary: "", tertiary: "", accent: "" });
  const supabase = createClient("https://" + env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);

  const onResize = () => {
    if (document.body.clientWidth >= 1150) {
      setViewport("Web");
    } else if (document.body.clientWidth >= 750) {
      setViewport("Tab");
    } else {
      setViewport("Mobile");
      setMore(false);
    }
  };

  useEffect(() => {
    if (more) {
      setCreate(false);
      setSearch(false);
    }

    if (create) {
      setMore(false);
      setSearch(false);
    }

    if (search) {
      setViewport("Tab");
      setMore(false);
      setCreate(false);
    } else {
      onResize();
    }

    if (viewport === "Mobile" && !create) {
      setHideSideComponents(true);
    }
  }, [viewport, search, create, more]);

  useEffect(() => {
    if (hideSideComponents) {
      create && setCreate(false);
      more && setMore(false);
      search && setSearch(false);
      setHideSideComponents(false);
    }
  }, [hideSideComponents]);

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

    setlsTheme(localStorage.getItem("theme") || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  return (
    <SessionProvider session={session}>
      <>
        {status === "authenticated" || status === "unauthenticated" ? (
          <>
            <Layout create={create} setCreate={setCreate} viewport={viewport} search={search} setSearch={setSearch} more={more} setMore={setMore} supabase={supabase} theme={theme} setTheme={setTheme} lsTheme={lsTheme} setlsTheme={setlsTheme} hideSideComponents={hideSideComponents} setHideSideComponents={setHideSideComponents} />
            <Component {...pageProps} viewport={viewport} supabase={supabase} theme={theme} user={user} />
          </>
        ) : (
          <GetUser user={user} setUser={setUser} theme={theme} status={status} setStatus={setStatus} />
        )}
      </>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
