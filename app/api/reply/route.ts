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

  let next_token: string | undefined;
  let totalIds: string[] = [];

  do {
    const endpointURL = `https://api.twitter.com/2/tweets/search/recent?tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id,referenced_tweets&query=conversation_id:${tweetId}&max_results=100${
      next_token ? `&next_token=${next_token}` : ""
    }`;
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
      const { result_count, next_token: new_next_token } = data.meta;
      next_token = new_next_token;
      console.log("next_token", next_token);
      let authorIds: string[] = [];

      if (result_count > 0) {
        if (data.data && data.data.length > 0) {
          authorIds = data.data
            .filter((tweet: any) =>
              tweet.referenced_tweets.some(
                (refTweet: any) => refTweet.id === tweetId
              )
            )
            .map((tweet: any) => tweet.author_id);
        } else {
          throw new Error("No tweets found in the response");
        }
      } else {
        throw new Error("No replies found for this tweet");
      }
      totalIds = [...totalIds, ...authorIds];
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({
        message: error.message,
        success: false,
        statusbar: "error",
      });
    }
  } while (next_token);

  const actual__author__count = totalIds.length;

  console.log("reply-ids", totalIds);
  return NextResponse.json({
    totalIds,
    actual__author__count,
    message: "reply ids are fetched successfully",
    success: true,
  });
}
