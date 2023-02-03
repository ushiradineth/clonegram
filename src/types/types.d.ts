import { type User, type Post, type Comment } from "@prisma/client";

export interface UserType {
  data: User & {
    followers: User[];
    following: User[];
    posts: Post[];
    blockedby: User[];
    blocking: User[];
    saved: Post[];
    likes: Post[];
    comments: Comment[];
    recentSearches: User[];
    notifications: Notfiication[];
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
}

export interface MemoType {
  user: UserType | null;
  theme: ThemeType | null;
  viewport: "Web" | "Tab" | "Mobile" | string;
  supabase: any | null;
}
