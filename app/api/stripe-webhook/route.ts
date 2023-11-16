import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { Stripe as StripeTypes } from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!secretKey || !webhookSecret) {
  throw new Error("Stripe secret keys are not set");
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    console.log("stripe-signature header or stripe webhook secret is not set");
    return new NextResponse("Error occurred", {
      status: 400,
    });
  }

  let evt: StripeTypes.Event;

  try {
    evt = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    console.log("Webhook constructed");

    const eventType: StripeTypes.Event["type"] = evt.type;

    if (eventType === "checkout.session.completed") {
      const session = evt.data.object as StripeTypes.Checkout.Session;
      console.log("Session", session);
      const userEmail = session.customer_email;
      console.log("User email", userEmail);

      if (!userEmail) {
        console.log("User email not found");
        return new NextResponse("Error occurred", {
          status: 400,
        });
      }
    }

    return new NextResponse("Success", {
      status: 200,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
    }
    return new NextResponse("Error occurred", {
      status: 400,
    });
  }
}
