import { z } from "zod";
import { env } from "../../../env/server.mjs";
import S3 from "aws-sdk/clients/s3";
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

  getSignedUrlPromise: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const s3 = new S3({
      accessKeyId: env.AMAZON_ACCESS_KEY,
      secretAccessKey: env.AMAZON_SECRET_KEY,
      region: "ap-south-1",
    });

    const fileParams = {
      Bucket: env.AMAZON_BUCKET_NAME,
      Key: "Users/Profile Pictures/" + input.id,
      Expires: 600,
      ContentType: "image",
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);

    return url;
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
});
