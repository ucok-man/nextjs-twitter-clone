import { auth } from "@/auth";
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";

export const PATCH = auth(async function PATCH(req, ctx) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  if (!ctx.params?.postId || typeof ctx.params?.postId !== "string") {
    return apiResponseErr(400, {
      message: "Invalid post id parameter",
    });
  }

  const postId = ctx.params.postId as string;

  try {
    const post = await prismaclient.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return apiResponseErr(
        404,
        "The resource you are looking for cannot be found"
      );
    }

    const currentUser = await prismaclient.user.findUnique({
      where: {
        id: req.auth.user?.id,
      },
    });
    if (!currentUser) {
      return apiResponseErr(
        404,
        "The resource you are looking for cannot be found"
      );
    }

    const alreadyLike = post.likedIds.find((id) => currentUser.id === id);

    // Procced to unlike
    if (alreadyLike) {
      const updatedPostLikedIds = post.likedIds.filter(
        (id) => id !== currentUser.id
      );
      const updatedPost = await prismaclient.post.update({
        where: {
          id: post.id,
        },
        data: {
          likedIds: {
            set: updatedPostLikedIds,
          },
        },
      });

      const updatedLikedPostIds = currentUser.likedPostIds.filter(
        (id) => id !== post.id
      );
      const updatedCurrentUser = await prismaclient.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          likedPostIds: {
            set: updatedLikedPostIds,
          },
        },
      });

      return apiResponseOK(200, {
        message: `Success unlike post ${post.id}`,
        currentUser: updatedCurrentUser,
        post: updatedPost,
      });
    }

    // procced to like
    if (!alreadyLike) {
      const updatedPost = await prismaclient.post.update({
        where: {
          id: post.id,
        },
        data: {
          likedIds: {
            push: currentUser.id,
          },
        },
      });

      const updatedCurrentUser = await prismaclient.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          likedPostIds: {
            push: post.id,
          },
        },
      });

      return apiResponseOK(200, {
        message: `Success unlike post ${post.id}`,
        currentUser: updatedCurrentUser,
        post: updatedPost,
      });
    }
  } catch (error) {
    console.log(`error like/unlike post: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
});
