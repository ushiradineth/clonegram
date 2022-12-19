import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  // hello: publicProcedure.input(z.object({ text: z.string().nullish() }).nullish()).query(({ input }) => {
  //   return {
  //     greeting: `Hello ${input?.text ?? "world"}`,
  //   };
  // }),
  getUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input.id,
      },
    });
  }),
  setUser: protectedProcedure.input(z.object({ id: z.string(), name: z.string(), email: z.string(), image: z.string(), handle: z.string(), bio: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        email: input.email,
        image: input.image,
        handle: input.handle,
        bio: input.bio,
      },
    });
  }),
  deleteUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: input.id,
      },
    });
  }),
});
