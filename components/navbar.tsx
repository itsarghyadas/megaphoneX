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
import { MdOutlineGeneratingTokens } from "react-icons/md";

const SigninButton = () => {
  return (
    <button className="px-6 py-2 font-medium bg-indigo-500 text-white w-fit rounded transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
      <Link href="/sign-in">Sign in</Link>
    </button>
  );
};

export default function SiteNav() {
  const { isSignedIn, user } = useUser();
  const { credits } = useCreditsStore();
  const username = user?.username;
  const userAvatar = user?.imageUrl;
  const { signOut } = useClerk();

  return (
    <section className="navbar ">
      <FromtopAlertDialog />
      <div className="border-b border-dashed">
        <section className="max-w-5xl mx-auto h-[3.7rem] py-3 px-5 flex items-center justify-between ">
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
              <div className="flex items-center gap-x-2">
                <SigninButton />
              </div>
            ) : (
              <div className="account__manage flex items-center gap-x-5">
                <a
                  href="/pricing"
                  className=" select-none flex items-center justify-center gap-x-2 border-2 border-amber-400 rounded-full px-1 md:px-1.5 md:py-0.5"
                >
                  <MdOutlineGeneratingTokens className="text-2xl text-amber-400" />
                  <span className="font-semibold text-sm">{credits}</span>
                </a>
                <div className="account__details select-none flex items-center gap-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none focus:ring-2 ring-offset-2 rounded-full">
                      <div className="account__details flex items-center gap-x-3">
                        <img
                          className="rounded-full w-6 h-6 ring-2 ring-slate-500/50"
                          src={userAvatar}
                          alt="useravatar"
                        />
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
              </div>
            )}
          </ClerkLoaded>
        </section>
      </div>
    </section>
  );
}
