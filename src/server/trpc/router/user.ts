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
        id: {
          equals: input.id
        }
      },
    });
  }),
});
