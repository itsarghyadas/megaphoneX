import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import oAuth from "oauth-1.0a";

const consumer_key = process.env.CONSUMER_APY_KEY as string;
const consumer_secret = process.env.CONSUMER_APY_SECRET as string;

const oauth = new oAuth({
  consumer: { key: consumer_key, secret: consumer_secret },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const { tweetId, token, tokenSecret } = bodyData;

  const tokenData = {
    key: token,
    secret: tokenSecret,
  };
  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: `https://api.twitter.com/2/tweets/${tweetId}/liking_users`,
        method: "GET",
      },
      tokenData
    )
  );
  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/${tweetId}/liking_users`,
      {
        headers: {
          "User-Agent": "v2LikingUsersJS",
          authorization: authHeader["Authorization"],
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to fetch liked ids - reason - ${errorData.status} - status - ${errorData.detail}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { result_count } = data.meta;
    let ids: string[] = [];

    if (result_count > 0) {
      if (data.data && data.data.length > 0) {
        ids = data.data.map((item: any) => item.id);
        console.log("liked-ids", ids);
      } else {
        throw new Error("No users found in the response");
      }
    } else {
      throw new Error("No likes found for this tweet");
    }

    console.log("liked-ids", ids);
    return NextResponse.json({
      ids,
      result_count,
      message: "Liked ids are fetched successfully",
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({
      message: error.message,
      success: false,
      statusbar: "error",
    });
  }
}
