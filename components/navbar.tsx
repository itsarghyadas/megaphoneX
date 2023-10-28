"use client";
import { useUser } from "@clerk/nextjs";
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FromtopAlertDialog } from "./formtopalertdialog";

export default function SiteNav() {
  const { isSignedIn, user } = useUser();
  const username = user?.username;
  const userAvatar = user?.imageUrl;

  return (
    <section className="navbar ">
      <div className="border-b border-dashed">
        <section className="max-w-5xl mx-auto py-3.5 px-5 flex items-center justify-between ">
          <div className="site__logo">
            <p className="font-bold text-lh">megaphoneX</p>
          </div>
          <ClerkLoading>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {!isSignedIn ? (
              <Button>Sign In</Button>
            ) : (
              <div className="account__details flex items-center gap-x-3">
                <img
                  className="rounded-full w-6 h-6 ring-2 ring-slate-500/50"
                  src={userAvatar}
                  alt="useravatar"
                />
                <p className="font-semibold text-sm">{username}</p>
              </div>
            )}
          </ClerkLoaded>
        </section>
      </div>
      <FromtopAlertDialog />
    </section>
  );
}
