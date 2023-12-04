"use client";
import { useUser } from "@clerk/nextjs";
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FromtopAlertDialog } from "./formtopalertdialog";
import { useClerk } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreditsStore } from "@/providers/creditsprovider";

export default function SiteNav() {
  const { isSignedIn, user } = useUser();
  const { credits } = useCreditsStore();
  const username = user?.username;
  const userAvatar = user?.imageUrl;
  const { signOut } = useClerk();

  return (
    <section className="navbar ">
      <div className="border-b border-dashed">
        <section className="max-w-5xl mx-auto h-14 py-2 px-5 flex items-center justify-between ">
          <div className="site__logo">
            <a href="/" className="font-bold text-lg">
              megaphoneX
            </a>
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
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "default" })}
              >
                Sign in
              </Link>
            ) : (
              <div className="account__details flex items-center gap-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none focus:ring-2 ring-offset-2 rounded-full">
                    <div className="account__details flex items-center gap-x-3">
                      <img
                        className="rounded-full w-6 h-6 ring-2 ring-slate-500/50"
                        src={userAvatar}
                        alt="useravatar"
                      />
                      <p className="font-semibold text-sm">{credits}</p>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-2 xl:mr-0">
                    <DropdownMenuLabel>
                      <p className="font-semibold text-sm">{username}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          signOut().then(() => {
                            window.location.href = "/";
                          });
                        }}
                      >
                        {" "}
                        Sign out
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="/dashboard">Dashboard</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </ClerkLoaded>
        </section>
      </div>
      <FromtopAlertDialog />
    </section>
  );
}
