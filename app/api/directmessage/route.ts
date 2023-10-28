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
        url: `https://api.twitter.com/2/dm_conversations/with/1694605719906193408/messages`,
        method: "POST",
      },
      tokenData
    )
  );
  try {
    const response = await fetch(
      `https://api.twitter.com/2/dm_conversations/with/1694605719906193408/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader["Authorization"],
        },
        body: JSON.stringify({
          text: "First message from my side",
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to send DM - reason - ${errorData.status} - status - ${errorData.detail}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return NextResponse.json({
      message: "DM sent successfully",
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
