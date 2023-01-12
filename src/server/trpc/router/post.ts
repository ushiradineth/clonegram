import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  setPost: protectedProcedure.input(z.object({ id: z.string(), links: z.array(z.string()), caption: z.string().nullish() })).mutation(({ input, ctx }) => {
    console.log(input.links);
    
    
    // return ctx.prisma.post.findFirst({
    //   where: {
    //     id: input.id,
    //     //todo
    //   },
    // });
  }),
  getPost: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.post.findFirst({
      where: {
        id: input.id,
      },
    });
  }),
  getAllUserPost: protectedProcedure.input(z.object({ userId: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        userId: input.userId,
      },
    });
  }),
  deletePost: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.post.delete({
      where: {
        id: input.id,
      },
    });
  }),
});
