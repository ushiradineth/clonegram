import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { env } from "../../../env/client.mjs";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findFirstOrThrow({
      where: {
        id: input.id,
      },
      include: {
        posts: true,
        saved: true,
        followers: true,
        following: true,
        blockedby: true,
        blocking: true,
        comments: true,
        likes: true,
        recentSearches: true,
        notifications: {
          include: {
            user: true,
            post: true,
            userRef: true,
          },
        },
      },
    });
  }),

  getUserByHandle: publicProcedure.input(z.object({ handle: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findFirstOrThrow({
      where: {
        handle: input.handle,
      },
      include: {
        posts: true,
        saved: true,
        followers: true,
        following: true,
        blockedby: true,
        blocking: true,
        comments: true,
        likes: true,
        recentSearches: true,
        notifications: {
          include: {
            user: true,
            post: true,
            userRef: true,
          },
        },
      },
    });
  }),

  updateUser: protectedProcedure.input(z.object({ id: z.string(), name: z.string().nullish(), image: z.string().nullish(), handle: z.string().nullish(), bio: z.object({ text: z.string().nullish(), changed: z.boolean() }) })).mutation(({ input, ctx }) => {
    type dataType = {
      [key: string]: string;
    };
    const data: dataType = {};

    if (input.name) data.name = input.name;
    if (input.image) data.image = input.image;
    if (input.handle) data.handle = input.handle;
    if (input.bio.changed) {
      !input.bio.text ? (data.bio = "") : (data.bio = input.bio.text);
    }

    return ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data,
    });
  }),

  deleteUser: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const supabase = createClient("https://" + env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);
    await supabase.storage.from("clonegram").remove([`Users/${input.id}`]);

    return ctx.prisma.user.delete({
      where: {
        id: input.id,
      },
    });
  }),

  follow: protectedProcedure.input(z.object({ userid: z.string(), pageid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { following: { connect: { id: input.pageid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: { followers: { connect: { id: input.userid } } },
    });

    const q3 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: {
        notifications: {
          create: {
            type: "Follow",
            userRef: {
              connect: {
                id: input.userid,
              },
            },
          },
        },
      },
    });

    return { q1, q2, q3 };
  }),

  unfollow: protectedProcedure.input(z.object({ userid: z.string(), pageid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { following: { disconnect: { id: input.pageid } } },
    });

    const q2 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: { followers: { disconnect: { id: input.userid } } },
    });

    return { q1, q2 };
  }),

  block: protectedProcedure.input(z.object({ userid: z.string(), pageid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: {
        blocking: { connect: { id: input.pageid } },
        following: { disconnect: { id: input.pageid } },
        followers: { disconnect: { id: input.pageid } },
      },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: {
        blockedby: { connect: { id: input.userid } },
        following: { disconnect: { id: input.userid } },
        followers: { disconnect: { id: input.userid } },
      },
    });

    return { q1, q2 };
  }),

  unblock: protectedProcedure.input(z.object({ userid: z.string(), pageid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { blocking: { disconnect: { id: input.pageid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: { blockedby: { disconnect: { id: input.userid } } },
    });

    return { q1, q2 };
  }),

  getUsersSearch: protectedProcedure.input(z.object({ key: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.user.findMany({
      where: {
        OR: [{ handle: { contains: input.key } }, { name: { contains: input.key } }],
      },
    });
  }),

  checkIfHandleUnique: protectedProcedure.input(z.object({ key: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        handle: input.key,
      },
    });
  }),
});
