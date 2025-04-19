import { auth } from "@/auth";

export default auth((req) => {
  const homepage = new URL("/", req.nextUrl.origin);

  if (
    !req.auth &&
    (req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/notifications"))
  ) {
    return Response.redirect(homepage);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
