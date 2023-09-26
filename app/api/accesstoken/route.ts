import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = body.userId;

  let token = "";
  let tokenSecret = "";

  if (userId) {
    const userAccessToken = await clerkClient.users.getUserOauthAccessToken(
      userId,
      "oauth_twitter"
    );
    if (userAccessToken[0]) {
      token = userAccessToken[0].token || "";
      tokenSecret = userAccessToken[0].tokenSecret || "";
    }
  }

  return NextResponse.json({ token: token, tokenSecret: tokenSecret });
}
