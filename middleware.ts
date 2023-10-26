import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  publicRoutes: [
    "/",
    "/privacy",
    "/sign-in",
    "/sign-up",
    "/api/users",
    "/api/accesstoken",
    "/api/retweet",
    "/api/likes",
    "/api/quote",
    "/api/reply",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
