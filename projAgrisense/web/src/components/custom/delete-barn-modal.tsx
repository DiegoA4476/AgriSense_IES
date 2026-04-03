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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteBarnModalProps {
  barnName: string;
  onConfirm: () => void;
}

export function DeleteBarnModal({ barnName, onConfirm }: DeleteBarnModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive bg-destructive/10 md:text-muted-foreground md:bg-transparent hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="space-y-0 gap-0">
          <div className="bg-destructive w-full">
            <div className="pt-6 pr-6 pl-6 pb-4">
              <AlertDialogTitle className="text-white">
                Delete Barn
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="sr-only">
            Confirm barn deletion
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-6 pt-3 pb-3 text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-foreground">{barnName}</span>? This action cannot be undone.
        </div>

        <AlertDialogFooter className="pr-6 pb-6 pl-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}