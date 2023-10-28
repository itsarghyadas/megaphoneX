import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import oAuth from "oauth-1.0a";
import axios from "axios";

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
  const endpointURL = `https://api.twitter.com/2/tweets/search/recent?tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id,referenced_tweets&query=conversation_id:${tweetId}`;
  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "GET",
      },
      tokenData
    )
  );

  let config = {
    method: "get",
    url: endpointURL,
    headers: {
      Authorization: `Bearer ${bearer_token}`,
      "User-Agent": "v2RecentSearchJS",
    },
  };

  try {
    const response = await axios.request(config);
    if (response.status !== 200) {
      const errorData = response.data;
      console.log("errorData", errorData);
      const errorMessage = `Failed to fetch reply ids - reason - ${errorData.status} - status - ${errorData.detail}`;
      throw new Error(errorMessage);
    }

    const data = response.data;

    let authorIds: string[] = [];

    for (let i = 0; i < data.data.length; i++) {
      const tweet = data.data[i];
      const referencedTweets = tweet.referenced_tweets;
      for (let j = 0; j < referencedTweets.length; j++) {
        const referencedTweet = referencedTweets[j];
        if (referencedTweet.id === tweetId) {
          authorIds.push(tweet.author_id);
          break;
        }
      }
    }
    const resultCount = authorIds.length;

    console.log("reply-ids", authorIds);
    return NextResponse.json({
      authorIds,
      resultCount,
      message: "reply ids are fetched successfully",
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      message: error.message,
      success: false,
      statusbar: "error",
    });
  }
}
