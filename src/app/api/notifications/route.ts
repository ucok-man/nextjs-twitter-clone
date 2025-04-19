import { auth } from "@/auth";
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  try {
    const notifications = await prismaclient.notification.findMany({
      where: {
        userId: req.auth.user?.id,
      },
    });
    const updatedCurrentUser = await prismaclient.user.update({
      where: {
        id: req.auth.user?.id,
      },
      data: {
        hasNotification: false,
      },
    });

    return apiResponseOK(200, {
      notifications: notifications,
      currentUser: updatedCurrentUser,
    });
  } catch (error) {
    console.log(`error get user notifications: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
});
