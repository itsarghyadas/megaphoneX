import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/usermodel";

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET || "";

interface Event {
  data: {
    id: string;
    user_id: string; // clerk user id
  };
  type: string;
}

export async function POST(req: any) {
  const dbClient = await connectDB();
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const svixId = req.headers.get("svix-id");
  const svixIdTimeStamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    return new Response("Error occurred", {
      status: 400,
    });
  }
  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
    console.log("Successfully verified event", evt);
    const userId = evt.data.user_id;
    const user = await clerkClient.users.getUser(userId);

    const userName = user.username;
    const userTwitterName = user.firstName;
    const userEmailId = user.emailAddresses[0].emailAddress;
    const userCredits = 0;

    // check if user exists in db
    const existingUser = await User.findOne({ user_id: userId });
    if (existingUser) {
      console.log("User already exists");
    } else {
      // create new user
      const newUser = new User({
        user_id: userId,
        username: userName,
        useremail: userEmailId,
        credits: userCredits,
      });
      await newUser.save();
    }

    const eventType: EventType = evt.type as EventType;
    console.log("eventType: ", eventType);

    if (eventType === "session.created") {
      console.log("session created");
      return new Response("Session created successfully", {
        status: 200,
      });
    }

    if (eventType === "session.ended") {
      console.log("session ended");

      return new Response("Session ended successfully", {
        status: 200,
      });
    }

    return new Response("Event type not handled", {
      status: 400,
    });
  } catch (error) {
    console.log("error", error);
    return new Response("Error occurred", {
      status: 400,
    });
  }
}

type EventType = "session.ended" | "session.created";
