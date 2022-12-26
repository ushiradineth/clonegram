import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  // hello: publicProcedure.input(z.object({ text: z.string().nullish() }).nullish()).query(({ input }) => {
  //   return {
  //     greeting: `Hello ${input?.text ?? "world"}`,
  //   };
  // }),

  getUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findFirstOrThrow({
      where: {
        id: input.id,
      },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });
  }),

  getUserByHandle: protectedProcedure.input(z.object({ handle: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findFirstOrThrow({
      where: {
        handle: input.handle,
      },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });
  }),

  updateUser: protectedProcedure.input(z.object({ id: z.string(), name: z.string().nullish(), image: z.string().nullish(), handle: z.string().nullish(), bio: z.string().nullish() })).mutation(({ input, ctx }) => {
    type dataType = {
      [key: string]: string;
    };
    const data: dataType = {};

    if (input.name) data.name = input.name!;
    if (input.image) data.image = input.image!;
    if (input.handle) data.handle = input.handle!;
    if (input.bio) data.bio = input.bio!;

    return ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data,
    });
  }),

  deleteUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: input.id,
      },
    });
  }),

  follow: protectedProcedure.input(z.object({ userid: z.string(), pageid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { following: { set: { id: input.pageid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: { followers: { set: { id: input.userid } } },
    });

    return { q1, q2 };
  }),

  unfollow: protectedProcedure.input(z.object({ userid: z.string(), pageid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { followers: { disconnect: { id: input.pageid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.pageid },
      data: { following: { disconnect: { id: input.userid } } },
    });

    return { q1, q2 };
  }),
});
