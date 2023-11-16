import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const storeItems = new Map([
  [1, { priceInCents: 300, name: "Starter Package" }],
  [2, { priceInCents: 1500, name: "Pro Package" }],
]);

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const id = bodyData.items[0].id;
  const quantity = bodyData.items[0].quantity;

  console.log("id:", id);
  console.log("quantity:", quantity);

  const user = await currentUser();
  if (!user) {
    return new Response("User not found", {
      status: 400,
    });
  }

  const userEmail = user.emailAddresses[0].emailAddress;
  console.log("userEmail in checkout: ", userEmail);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2023-10-16",
  });

  const session = await stripe.checkout.sessions.create({
    invoice_creation: { enabled: true },
    payment_method_types: ["card"],
    mode: "payment",
    billing_address_collection: "required",
    line_items: bodyData.items.map((item: { id: number; quantity: number }) => {
      const storeItem = storeItems.get(item.id);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: storeItem?.name,
          },
          unit_amount: storeItem?.priceInCents,
        },
        quantity: item.quantity,
      };
    }),
    success_url: webUrl + `/form?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: webUrl,
    customer_email: userEmail,
  });

  return new Response(JSON.stringify({ url: session.url }));
}
