import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import oAuth from "oauth-1.0a";
import connectDB from "@/lib/mongodb";
import TwitterForm from "@/models/twittermodel";
import DmDetails from "@/models/dmmodel";

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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUserDetails(
  ids: string[],
  tokenData: any,
  tweetId: string,
  timestamp: string
) {
  const joinedIds = ids.join(",");
  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: `https://api.twitter.com/2/users?user.fields=profile_image_url&ids=${joinedIds}`,
        method: "GET",
      },
      tokenData
    )
  );

  const url = `https://api.twitter.com/2/users?user.fields=profile_image_url&ids=${joinedIds}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: authHeader["Authorization"],
      "User-Agent": "TwitterDevSampleCode",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = `Failed to get user objects - reason - ${errorData.status} - status - ${errorData.detail}`;
    throw new Error(errorMessage);
  }

  const profileData = await response.json();
  const usernames = profileData.data.map((item: any) => item.username);
  const profileImageUrls = profileData.data.map(
    (item: any) => item.profile_image_url
  );

  return {
    usernames,
    profileImageUrls,
  };
}

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const { tweetId, commonIds, token, tokenSecret, message, timestamp } =
    bodyData;
  console.log("bodyData in sendDms", bodyData);
  await connectDB();
  const tokenData = {
    key: token,
    secret: tokenSecret,
  };
  let sentIDs = [];
  let unsendIDs = [];
  let errors = [];
  let sentUsernames: string[] = [];
  let sentUserProfileImageUrls: string[] = [];
  let unsendUsernames: string[] = [];
  let unsendUserProfileImageUrls: string[] = [];
  for (const commonId of commonIds) {
    console.log("commonId in sendDms", commonId);
    const authHeader = oauth.toHeader(
      oauth.authorize(
        {
          url: `https://api.twitter.com/2/dm_conversations/with/${commonId}/messages`,
          method: "POST",
        },
        tokenData
      )
    );
    try {
      const response = await fetch(
        `https://api.twitter.com/2/dm_conversations/with/${commonId}/messages`,
        {
          method: "POST",
          headers: {
            authorization: authHeader["Authorization"],
            "Content-Type": "application/json",
            "User-Agent": "TwitterDevSampleCode",
          },
          body: JSON.stringify({
            text: message,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = `Failed to send DM - reason - ${errorData.status} - status - ${errorData.detail}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("data in sendDms", data);

      await TwitterForm.updateOne(
        { tweetID: tweetId, timestamp: timestamp },
        { $set: { status: "Done" } }
      );

      sentIDs.push(commonId);
      if (sentIDs.length > 0) {
        const ids = sentIDs.join(",");
        const authHeader = oauth.toHeader(
          oauth.authorize(
            {
              url: `https://api.twitter.com/2/users?user.fields=profile_image_url&ids=${ids}`,
              method: "GET",
            },
            tokenData
          )
        );

        const url = `https://api.twitter.com/2/users?user.fields=profile_image_url&ids=${ids}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            authorization: authHeader["Authorization"],
            "User-Agent": "TwitterDevSampleCode",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = `Failed to get user objects - reason - ${errorData.status} - status - ${errorData.detail}`;
          throw new Error(errorMessage);
        }

        const sendProfileData = await response.json();
        console.log("User objects for unsendIDs", sendProfileData);
        const sendUsernames = sendProfileData.data.map(
          (item: any) => item.username
        );
        const sendUserProfileImageUrls = sendProfileData.data.map(
          (item: any) => item.profile_image_url
        );

        console.log(sendUsernames);
        if (sendUsernames.length > 0) {
          const dmDetailsEntry = new DmDetails({
            tweetid: tweetId,
            timestamp: timestamp,
            sentusers: sendUsernames,
            sentprofileimageurl: sendUserProfileImageUrls,
          });

          await dmDetailsEntry.save();
          console.log("dmDetailsEntry", dmDetailsEntry);
        }
      }
      // Add delay here
      await delay(4500);
    } catch (error: any) {
      console.error(error.message);
      unsendIDs.push(commonId);
      errors.push(error.message);
      console.log("unsendIDs in sendDms", unsendIDs);
    }
  }

  if (unsendIDs.length > 0) {
    const ids = unsendIDs.join(",");
    const authHeader = oauth.toHeader(
      oauth.authorize(
        {
          url: `https://api.twitter.com/2/users?user.fields=profile_image_url&ids=${ids}`,
          method: "GET",
        },
        tokenData
      )
    );

    const url = `https://api.twitter.com/2/users?user.fields=profile_image_url&ids=${ids}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: authHeader["Authorization"],
        "User-Agent": "TwitterDevSampleCode",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to get user objects - reason - ${errorData.status} - status - ${errorData.detail}`;
      throw new Error(errorMessage);
    }

    const unsendProfileData = await response.json();
    console.log("User objects for unsendIDs", unsendProfileData);
    const unsendUsernames = unsendProfileData.data.map(
      (item: any) => item.username
    );
    const unsendUserProfileImageUrls = unsendProfileData.data.map(
      (item: any) => item.profile_image_url
    );

    console.log(unsendUsernames);
    console.log(unsendUserProfileImageUrls);
    if (unsendUsernames.length > 0) {
      const dmDetailsEntry = new DmDetails({
        tweetid: tweetId,
        timestamp: timestamp,
        unsentusers: unsendUsernames,
        unsentprofileimageurl: unsendUserProfileImageUrls,
      });

      await dmDetailsEntry.save();
      console.log("dmDetailsEntry", dmDetailsEntry);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({
      message: errors.join(", "),
      success: false,
      statusbar: "error",
      unsendUsernames: unsendUsernames,
      unsendprofileImageUrls: unsendUserProfileImageUrls,
    });
  }

  return NextResponse.json({
    message: "DMs sent successfully",
    success: true,
    unsendUsernames: unsendUsernames,
    unsendprofileImageUrls: unsendUserProfileImageUrls,
  });
}
