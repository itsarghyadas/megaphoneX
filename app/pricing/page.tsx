"use client";
import React, { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const webUrl = process.env.NEXT_PUBLIC_WEB_URL;

type CheckoutResponse = {
  url: string;
};

type ErrorResponse = {
  error: string;
};

async function createCheckoutSession(
  itemId: number,
  quantity: number
): Promise<string> {
  const response = await fetch(`${webUrl}/api/stripe-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ id: itemId, quantity }],
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.error);
  }

  const { url } = (await response.json()) as CheckoutResponse;
  return url;
}

type MembershipOptionProps = {
  title: string;
  tokens: string;
  price: number;
  quantity: number;
  handleClick: () => void;
  incrementQuantity?: () => void;
  decrementQuantity?: () => void;
};
const MembershipOption = ({
  title,
  tokens,
  price,
  quantity,
  handleClick,
  incrementQuantity,
  decrementQuantity,
}: MembershipOptionProps) => (
  <div className="option relative w-full border rounded-lg p-6 ">
    <div className="flex h-full flex-col">
      <h2 className="text-2xl leading-6 underline decoration-dashed decoration-1 underline-offset-8">
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-y-2 font-semibold">
        <div className="text-indigo-600 ">🎯 {tokens}</div>
        <div className="text-primary/70">🎯 Auto DM with dashboard</div>
        <div className="text-primary/70">🎯 Credit Topup</div>
      </div>
      <div className="flex items-center space-x-10 pt-7">
        <div>
          <span className="white text-4xl font-bold text-slate-700">
            ${price}
          </span>
          <span className="text-base font-medium">/ Individual</span>
        </div>
      </div>

      <button
        className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[radial-gradient(100%_100%_at_100%_0%,_#af8bee_0%,_#6903f6_100%)] px-8 py-2 text-base text-white shadow drop-shadow transition-all hover:brightness-110 active:scale-95 "
        onClick={handleClick}
      >
        Get started
      </button>
    </div>
    {incrementQuantity && decrementQuantity && (
      <div className="absolute top-1 right-1 flex items-center justify-center border p-1 rounded-md">
        <button
          className="flex h-6 w-6 items-center justify-center rounded-sm border border-slate-800/30 bg-amber-300 text-gray-700"
          onClick={decrementQuantity}
        >
          -
        </button>
        <span className="mx-2">{quantity}</span>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-sm border border-slate-800/30 bg-amber-300 text-gray-700 "
          onClick={incrementQuantity}
        >
          +
        </button>
      </div>
    )}
  </div>
);

function Pricing() {
  const [quantity, setQuantity] = useState<number>(1);
  const { isSignedIn } = useUser();

  const incrementQuantity = useCallback(() => {
    if (quantity < 3) {
      setQuantity(quantity + 1);
    }
  }, [quantity]);

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  const handleClick = useCallback(
    async (itemId: number) => {
      let currentQuantity = quantity;
      if (itemId === 2) {
        setQuantity(1);
        currentQuantity = 1;
      }

      if (!isSignedIn) {
        window.location.href = "/sign-in";
        return;
      }

      try {
        const url = await createCheckoutSession(itemId, currentQuantity);
        window.location.href = url;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [isSignedIn, quantity]
  );
  return (
    <div className="dashboard flex flex-col justify-center items-center min-h-[calc(100vh-90px)] font-bold">
      <div className="container mx-auto max-w-4xl px-5 sm:mb-0 py-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="font-logo mt-4 text-center text-5xl font-bold md:text-6xl">
            Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-[18rem] md:max-w-lg text-center text-base text-primary/70 font-semibold">
            Choose a plan that works for you without breaking the bank 🔥
          </p>
          <div className="my-8 space-y-8 md:mt-14 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            <MembershipOption
              title="Starter"
              tokens={70 * quantity + " Credits"}
              price={3 * quantity}
              handleClick={() => handleClick(1)}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              quantity={quantity}
            />
            <MembershipOption
              title="Pro"
              tokens="500 Credits"
              price={15}
              handleClick={() => handleClick(2)}
              quantity={quantity}
            />
          </div>
          <div>
            <Alert>
              <AlertTitle>👋 Sorry for the inconvinience</AlertTitle>
              <AlertDescription className="pt-2 font-semibold text-sm">
                As per our terms of service, we do not offer refunds. We get
                your request and start the campaign as soon as possible. So, we
                can&apos;t offer refunds at the moment.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
