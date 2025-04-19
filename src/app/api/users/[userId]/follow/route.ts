import { auth } from "@/auth";
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";

export const PATCH = auth(async function PATCH(req, ctx) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  if (!ctx.params?.userId || typeof ctx.params?.userId !== "string") {
    return apiResponseErr(400, {
      message: "Invalid user id parameter",
    });
  }

  const followId = ctx.params.userId as string;

  try {
    const userToFollow = await prismaclient.user.findUnique({
      where: {
        id: followId,
      },
    });
    if (!userToFollow) {
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

    const alreadyFollow = userToFollow?.followerIds.find(
      (id) => currentUser.id === id
    );

    // Procced to unfollow
    if (alreadyFollow) {
      const updatedFollowersIds = userToFollow.followerIds.filter(
        (id) => id !== currentUser.id
      );
      const updateFollowUser = await prismaclient.user.update({
        where: {
          id: userToFollow.id,
        },
        data: {
          followerIds: {
            set: updatedFollowersIds,
          },
        },
      });

      const updatedFollowingIds = currentUser.followingIds.filter(
        (id) => id !== userToFollow.id
      );
      const updateCurrentUser = await prismaclient.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          followingIds: {
            set: updatedFollowingIds,
          },
        },
      });

      return apiResponseOK(200, {
        message: `Success unfollow user ${userToFollow.id}`,
        followUser: updateFollowUser,
        currentUser: updateCurrentUser,
      });
    }

    // procced to follow
    if (!alreadyFollow) {
      const updateFollowUser = await prismaclient.user.update({
        where: {
          id: userToFollow.id,
        },
        data: {
          followerIds: {
            push: currentUser.id,
          },
        },
      });

      const updateCurrentUser = await prismaclient.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          followingIds: {
            push: userToFollow.id,
          },
        },
      });

      return apiResponseOK(200, {
        message: `Success following user ${userToFollow.id}`,
        followUser: updateFollowUser,
        currentUser: updateCurrentUser,
      });
    }
  } catch (error) {
    console.log(`error follow/unfollow post: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
});
