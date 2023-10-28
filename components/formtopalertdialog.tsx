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
          As we are on a Twitter API Basic plan{" "}
          <span className="underline underline-offset-4">Learn More</span>
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Read this before you start 👋</AlertDialogTitle>
          <AlertDialogDescription className="text-justify">
            As we are on a Twitter API Basic plan, we don't have access to the
            `followers` field. Following you is a requirement to send DMs, so
            sometimes not everyone will receive the DM.
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
