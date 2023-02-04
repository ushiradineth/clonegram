import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { env } from "../../../env/client.mjs";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  setPost: protectedProcedure.input(z.object({ index: z.number(), id: z.string(), links: z.array(z.string()), caption: z.string().nullish() })).mutation(({ input, ctx }) => {
    return ctx.prisma.post.create({
      data: {
        index: input.index,
        user: { connect: { id: input.id } },
        caption: input.caption || "",
        imageURLs: input.links,
      },
    });
  }),

  getHomeFeed: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const q1 = await ctx.prisma.post.findMany({
      where: {
        AND: [
          {
            user: {
              followers: {
                some: {
                  id: {
                    contains: input.id,
                  },
                },
              },
            },
          },
          {
            likes: {
              every: {
                id: {
                  not: {
                    equals: input.id,
                  },
                },
              },
            },
          },
          {
            user: {
              id: {
                not: {
                  equals: input.id,
                },
              },
            },
          },
        ],
      },
      include: {
        user: true,
        likes: true,
      },
      orderBy: [
        {
          likes: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      take: 10,
    });

    const q2 = await ctx.prisma.post.findMany({
      where: {
        AND: [
          {
            user: {
              followers: {
                none: {
                  id: {
                    contains: input.id,
                  },
                },
              },
            },
          },
          {
            likes: {
              every: {
                id: {
                  not: {
                    equals: input.id,
                  },
                },
              },
            },
          },
          {
            user: {
              id: {
                not: {
                  equals: input.id,
                },
              },
            },
          },
          {
            user: {
              blocking: {
                every: {
                  id: {
                    not: {
                      equals: input.id,
                    },
                  },
                },
              },
            },
          },
          {
            user: {
              blockedby: {
                every: {
                  id: {
                    not: {
                      equals: input.id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        user: true,
        likes: true,
      },
      orderBy: [
        {
          likes: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      take: 10,
    });

    return { q1, q2 };
  }),

  getPost: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.post.findFirst({
      where: {
        id: input.id,
      },
      include: {
        user: true,
        likes: true,
        comments: {
          include: {
            user: true,
          },
        },
        saved: true,
      },
    });
  }),

  deletePost: protectedProcedure.input(z.object({ userid: z.string(), postid: z.string(), index: z.number() })).mutation(async ({ input, ctx }) => {
    const supabase = createClient("https://" + env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);
    const { data: list } = await supabase.storage.from("clonegram").list(`Users/${input.userid}/Posts/${input.index}`);

    const filesToRemove = list?.map((x) => `Users/${input.userid}/Posts/${input.index}/${x.name}`);
    await supabase.storage.from("clonegram").remove(filesToRemove || [""]);

    return ctx.prisma.post.delete({
      where: { id: input.postid },
    });
  }),

  likePost: protectedProcedure.input(z.object({ postid: z.string(), postOwnerid: z.string(), userid: z.string() })).mutation(async ({ input, ctx }) => {
    const q1 = await ctx.prisma.post.update({
      where: { id: input.postid },
      data: { likes: { connect: { id: input.userid } } },
    });

    const q2 = await ctx.prisma.user.update({
      where: { id: input.userid },
      data: { likes: { connect: { id: input.postid } } },
    });

    const q3 = await ctx.prisma.user.update({
      where: { id: input.postOwnerid },
      data: {
        notifications: {
          create: {
            type: "Like",
            notificationCreator: {
              connect: {
                id: input.userid,
              },
            },
            post: {
              connect: {
                id: input.postid,
              },
            },
          },
        },
      },
    });

    return { q1, q2, q3 };
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

  setcomment: protectedProcedure.input(z.object({ postid: z.string(), userid: z.string(), text: z.string() })).mutation(async ({ input, ctx }) => {
    return ctx.prisma.comment.create({
      data: {
        text: input.text,
        user: { connect: { id: input.userid } },
        post: { connect: { id: input.postid } },
      },
    });
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
