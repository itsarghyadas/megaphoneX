import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TwitterForm from "@/models/twittermodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  console.log(bodyData);
  const userID = bodyData.userId;
  const posturl: string = bodyData.posturl;
  const message: string = bodyData.dmmessage;
  const checkboxItems: string[] = bodyData.checkboxItems;
  const executionTime: string = bodyData.timeperiod;
  const totalUserNumber: number = bodyData.usernumber;
  const matchedId: RegExpMatchArray | null = posturl.match(/\/status\/(\d+)/);
  if (!matchedId) {
    return;
  }
  const tweetId: string = matchedId[1];

  await connectDB();

  const newForm = new TwitterForm({
    userID: userID,
    tweetID: tweetId,
    posturl: posturl,
    dmmessage: message,
    checkboxItems,
    timeperiod: executionTime,
    usernumber: totalUserNumber,
    status: "pending",
  });

  await newForm.save();

  return NextResponse.json({ success: true, data: newForm });
}
