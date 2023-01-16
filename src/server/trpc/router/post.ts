import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  setPost: protectedProcedure.input(z.object({ id: z.string(), links: z.array(z.string()), caption: z.string().nullish() })).mutation(({ input, ctx }) => {
    input.links.forEach((e) => console.log(e));

    return ctx.prisma.post.create({
      data: {
        user: { connect: { id: input.id } },
        caption: input.caption || "",
        imageURLs: input.links,
      },
    });
  }),

  getPost: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.post.findFirst({
      where: {
        id: input.id,
      },
      include: {
        user: true
      }
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
