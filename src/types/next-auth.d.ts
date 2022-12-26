import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      handle: string;
      theme: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    handle: string;
    theme: string;
    email: string;
    name: string;
    image: string;
  }
}
