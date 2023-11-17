import { Webhook } from "svix";
import { currentUser } from "@clerk/nextjs";

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET || "";

interface Event {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    created_at: number;
  };
  type: string;
}

export async function POST(req: any) {
  const payload = await req.json();
  const user = await currentUser();
  console.log("user", user);
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
