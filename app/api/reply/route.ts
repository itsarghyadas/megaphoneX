import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import oAuth from "oauth-1.0a";

const consumer_key = process.env.CONSUMER_APY_KEY as string;
const consumer_secret = process.env.CONSUMER_APY_SECRET as string;
const bearer_token = process.env.TWITTER_BEARER_KEY as string;

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
  const endpointURL = `https://api.twitter.com/2/tweets/search/recent?tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id,referenced_tweets&query=conversation_id:1705077498579665067`;

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "GET",
      },
      tokenData
    )
  );
  try {
    const response = await fetch(endpointURL, {
      headers: {
        "User-Agent": "v2RecentSearchJS",
        authorization: authHeader["Authorization"],
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log("errorData", errorData);
      const errorMessage = `Failed to fetch reply ids - reason - ${errorData.status} - status - ${errorData.detail}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("reply-data", data);
    return NextResponse.json({
      message: "reply ids are fetched successfully",
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
