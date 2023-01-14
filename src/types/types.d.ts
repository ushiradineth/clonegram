import { type User, type Post } from "@prisma/client";

export interface UserType {
  data: User & {
    followers: User[];
    following: User[];
    posts: Post[];
    blockedby: User[];
    blocking: User[];
  };
  refetch: any;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetching: boolean;
  isFetched: boolean;
}

export interface ThemeType {
  type: string;
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
}

export interface MemoType {
  user: UserType | null;
  theme: ThemeType | null;
  viewport: "Web" | "Tab" | "Mobile" | string;
  supabase: any | null;
}
