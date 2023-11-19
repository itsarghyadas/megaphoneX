import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TwitterForm from "@/models/twittermodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  console.log(bodyData);
  const posturl: string = bodyData.posturl;
  const message: string = bodyData.dmmessage;
  const checkboxItems: string[] = bodyData.checkboxItems;
  const executionTime: string = bodyData.timeperiod;
  const totalUserNumber: number = bodyData.usernumber;

  await connectDB();

  const newForm = new TwitterForm({
    posturl,
    dmmessage: message,
    checkboxItems,
    timeperiod: executionTime,
    usernumber: totalUserNumber,
  });

  await newForm.save();

  return NextResponse.json({ success: true });
}
