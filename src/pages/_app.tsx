import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import React, { useState, useEffect, createContext } from "react";
import Layout from "../components/Layout";
import { createClient } from "@supabase/supabase-js";
import { env } from "../env/client.mjs";
import themeObject from "../components/Theme";
import GetUser from "../components/GetUser";
import { type MemoType } from "../types/types";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const DataContext = createContext<MemoType | undefined | null>(null);

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [viewport, setViewport] = useState("");
  const [more, setMore] = useState(false);
  const [create, setCreate] = useState(false);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState(false);
  const [notification, setNotification] = useState(false);
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
      setNotification(false);
    }
  }, [more]);

  useEffect(() => {
    if (create) {
      setMore(false);
      setSearch(false);
      setNotification(false);
    }
  }, [create]);

  useEffect(() => {
    if (search) {
      setViewport("Tab");
      setMore(false);
      setCreate(false);
      setNotification(false);
    } else {
      onResize();
    }
  }, [search]);

  useEffect(() => {
    if (notification) {
      setViewport("Tab");
      setMore(false);
      setCreate(false);
      setSearch(false);
    } else {
      onResize();
    }
  }, [notification]);

  useEffect(() => {
    if (viewport === "Mobile" && !create) {
      setHideSideComponents(true);
    }
  }, [viewport]);

  useEffect(() => {
    if (hideSideComponents) {
      create && setCreate(false);
      more && setMore(false);
      search && setSearch(false);
      notification && setNotification(false);
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

  const value = React.useMemo(() => {
    return {
      user,
      theme,
      viewport,
      supabase,
    };
  }, [user, theme, viewport, supabase]);

  return (
    <SessionProvider session={session}>
      <>
        {status === "authenticated" || status === "unauthenticated" ? (
          <>
            <GetUser user={user} setUser={setUser} theme={theme} status={status} setStatus={setStatus} enabled={false} />
            <DataContext.Provider value={value}>
              <Layout create={create} setCreate={setCreate} search={search} setSearch={setSearch} notification={notification} setNotification={setNotification} more={more} setMore={setMore} setTheme={setTheme} lsTheme={lsTheme} setlsTheme={setlsTheme} hideSideComponents={hideSideComponents} setHideSideComponents={setHideSideComponents} />
              <Component {...pageProps} />
              <ToastContainer />
            </DataContext.Provider>
          </>
        ) : (
          <GetUser user={user} setUser={setUser} theme={theme} status={status} setStatus={setStatus} enabled={true} />
        )}
      </>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
