import { type User } from "@prisma/client";

export interface UserType {
  
  data: User & {
    followers: User[];
    following: User[];
    posts: User[];
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
