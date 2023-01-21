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
        user: true,
        likes: true,
        comments: true,
        saved: true,
      },
    });
  }),

  deletePost: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.post.delete({
      where: { id: input.id },
    });
  }),

  likePost: protectedProcedure.input(z.object({ postid: z.string(), userid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.post.update({
      where: { id: input.postid },
      data: { likes: { connect: { id: input.userid } } },
    });

    const q2 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { likes: { connect: { id: input.postid } } },
    });

    return { q1, q2 };
  }),

  unlikePost: protectedProcedure.input(z.object({ postid: z.string(), userid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.post.update({
      where: { id: input.postid },
      data: { likes: { disconnect: { id: input.userid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { likes: { disconnect: { id: input.postid } } },
    });

    return { q1, q2 };
  }),

  savePost: protectedProcedure.input(z.object({ postid: z.string(), userid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.post.update({
      where: { id: input.postid },
      data: { saved: { connect: { id: input.userid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { saved: { connect: { id: input.postid } } },
    });

    return { q1, q2 };
  }),

  unsavePost: protectedProcedure.input(z.object({ postid: z.string(), userid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.post.update({
      where: { id: input.postid },
      data: { saved: { disconnect: { id: input.userid } } },
    });
    const q2 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { saved: { disconnect: { id: input.postid } } },
    });

    return { q1, q2 };
  }),

  setcomment: protectedProcedure.input(z.object({ postid: z.string(), userid: z.string(), text: z.string(), parentReplyID: z.string().nullish() })).mutation(async ({ input, ctx }) => {
    if (input.parentReplyID) {
      const q1 = await ctx.prisma.comment.create({
        data: {
          text: input.text,
          user: { connect: { id: input.userid } },
          post: { connect: { id: input.postid } },
          parentReply: { connect: { id: input.parentReplyID } },
        },
      });

      const q2 = await ctx.prisma.comment.update({
        where: { id: input.parentReplyID },
        data: {
          replies: { connect: { id: q1.id } },
        },
      });

      return { q1, q2 };
    } else {
      return ctx.prisma.comment.create({
        data: {
          text: input.text,
          user: { connect: { id: input.userid } },
          post: { connect: { id: input.postid } },
        },
      });
    }
  }),

  deleteComment: protectedProcedure.input(z.object({ commentid: z.string(), userid: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.comment.delete({
      where: { id: input.commentid },
    });
  }),

  likecomment: protectedProcedure.input(z.object({ commentid: z.string(), userid: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.comment.update({
      where: { id: input.commentid },
      data: { likes: { connect: { id: input.userid } } },
    });
  }),

  unlikecomment: protectedProcedure.input(z.object({ commentid: z.string(), userid: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.comment.update({
      where: { id: input.commentid },
      data: { likes: { disconnect: { id: input.userid } } },
    });
  }),
});
