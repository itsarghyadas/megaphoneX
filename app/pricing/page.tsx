"use client";
import React, { useState, useEffect } from "react";
import { ClerkProvider, RedirectToSignIn, SignedIn } from "@clerk/nextjs";

type User = {
  email: string;
  _id: string;
};

type TokenResponse = {
  totalToken: number;
};

type CheckoutResponse = {
  url: string;
};

type ErrorResponse = {
  error: string;
};

function Pricing() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [token, setToken] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const incrementQuantity = () => {
    if (quantity < 3) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:1337/api/loggeduser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const { userName } = await response.json();
        const userEmailResponse = await fetch(
          `http://localhost:1337/api/user/${userName}`
        );
        const { user } = (await userEmailResponse.json()) as { user: User };
        setUserEmail(user.email);
        const userId = user._id;
        setUserId(userId);
        const availableTokenResponse = await fetch(
          `http://localhost:1337/api/totalTokens?userId=${userId}`
        );
        const { totalToken } =
          (await availableTokenResponse.json()) as TokenResponse;
        setToken(totalToken);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  }, []);

  const handleClick = async (itemId: number) => {
    localStorage.setItem("itemId", itemId.toString());
    localStorage.setItem("quantity", quantity.toString());
    console.log(itemId);
    console.log(quantity);
    try {
      const response = await fetch("http://localhost:1337/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          items: [{ id: itemId, quantity: quantity }],
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error);
      }

      const { url } = (await response.json()) as CheckoutResponse;
      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  type MembershipOptionProps = {
    title: string;
    tokens: string;
    price: number;
    handleClick: () => void;
    incrementQuantity?: () => void;
    decrementQuantity?: () => void;
  };

  const MembershipOption = ({
    title,
    tokens,
    price,
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
          className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-t from-indigo-600 via-indigo-600 to-indigo-500 px-8 py-2 text-base text-white shadow drop-shadow transition-all hover:brightness-110 active:scale-95 "
          onClick={handleClick}
        >
          Get started
        </button>
      </div>
      {incrementQuantity && decrementQuantity && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center border bg-purple-600 p-1 rounded-full">
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-800/30 bg-amber-300 text-gray-700"
            onClick={decrementQuantity}
          >
            -
          </button>
          <span className="mx-2 text-white">{quantity}</span>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-800/30 bg-amber-300 text-gray-700 "
            onClick={incrementQuantity}
          >
            +
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard flex flex-col items-center pb-14 font-bold">
      <div className="container mx-auto mb-32 max-w-4xl px-5 pt-8 pb-16 sm:mb-0 sm:pt-10">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="font-logo mt-4 text-center text-5xl font-bold md:text-6xl">
            Memberships
          </h1>
          <p className="m-auto mt-4 max-w-2xl text-center text-base text-slate-700/70">
            Choose a plan that works for you 🚀
          </p>
          <div className="my-8 space-y-8 md:mt-14 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            <MembershipOption
              title="Starter"
              tokens={70 * quantity + " Credits"}
              price={3 * quantity}
              handleClick={() => handleClick(1)}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
            <MembershipOption
              title="Pro"
              tokens="500 Credits"
              price={15}
              handleClick={() => handleClick(2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
