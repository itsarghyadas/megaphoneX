import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import oAuth from "oauth-1.0a";

const consumer_key = process.env.CONSUMER_APY_KEY as string;
const consumer_secret = process.env.CONSUMER_APY_SECRET as string;

const oauth = new oAuth({
  consumer: { key: consumer_key, secret: consumer_secret },
  signature_method: "HMAC-SHA1",
  hash_function(base_string: string, key: string) {
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

  const url = `https://api.twitter.com/2/tweets/${tweetId}/quote_tweets?expansions=author_id`;

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url,
        method: "GET",
      },
      tokenData
    )
  );

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "v2QuoteTweetsJS",
        authorization: authHeader["Authorization"],
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to fetch quoted ids - reason - ${errorData.status} - status - ${errorData.detail}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { result_count } = data.meta;
    let ids: string[] = [];

    if (result_count > 0) {
      if (data.includes.users && data.includes.users.length > 0) {
        ids = data.includes.users.map((item: any) => item.id);
        console.log("quoted-ids", ids);
      } else {
        throw new Error("No users found in the response");
      }
    } else {
      throw new Error("No quotes found for this tweet");
    }

    return NextResponse.json({
      ids,
      result_count,
      message:
        result_count > 0
          ? "quoted ids are fetched successfully"
          : "No quotes found for this tweet",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
      success: false,
      statusbar: "error",
    });
  }
}
