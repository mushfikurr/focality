import { Doc } from "@/convex/_generated/dataModel";
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
} from "../ui/alert-dialog";

type ConfirmJoinSessionDialog = {
  session: Doc<"sessions">;
  children: React.ReactNode;
  onConfirm: () => void;
};

function ConfirmJoinSessionDialog({
  session,
  children,
  onConfirm,
}: ConfirmJoinSessionDialog) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are joining {session.title}</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove you from your current focus session. Are you sure
            you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep me in</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes, leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmJoinSessionDialog;
