import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/usermodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  console.log(bodyData);
  const { userId } = bodyData;

  // Check if userId is provided
  if (!userId) {
    return NextResponse.json({ success: false, message: "userId is required" });
  }

  await connectDB();
  const userData = await User.find({ user_id: userId });

  // Check if userData is not empty
  if (!userData || userData.length === 0) {
    return NextResponse.json({ success: false, message: "User not found" });
  }

  const credits = userData[0].credits;
  console.log("checked credits", credits);

  return NextResponse.json({ success: true, credits: credits });
}
