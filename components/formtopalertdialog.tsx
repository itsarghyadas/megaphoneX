import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function FromtopAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
        className="w-full bg-cyan-700 text-white mx-auto font-medium text-base p-1 border-t-0 border-l-0 border-r-0 rounded-none"
      >
        <p className="cursor-pointer text-sm text-center">
          As we are on a Twitter API Basic plan.{" "}
          <span className="underline underline-offset-4">Learn More</span>
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Read this before you start 👋</AlertDialogTitle>
          <AlertDialogDescription className="text-justify">
            As we are on a Twitter API Basic plan, we don't have access to the{" "}
            <span className="font-bold text-red-500 underline underline-offset-2">
              followers
            </span>{" "}
            API. Following you is a requirement to send DMs, so sometimes not
            everyone will receive the DM.
            <br />
            <br />
            But don&apos;t worry, we will give you a list of people who
            didn&apos;t get a DM so you can send it manually.
            <br />
            <br />
            <span className="font-semibold text-amber-500">
              We will come with something in the next phase to solve this.
              Thanks for your patience 🔥
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full">
          <AlertDialogAction className="bg-green-700">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
