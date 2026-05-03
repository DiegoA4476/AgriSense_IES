import { useState } from "react";
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

interface DeleteDialogProps {
  name: string;
  onConfirm: () => void;
  isPending?: boolean;
  trigger: React.ReactNode;
  onTriggerClick?: (e: React.MouseEvent) => void;
}

export function DeleteDialog({ name, onConfirm, isPending, trigger, onTriggerClick }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger onClick={onTriggerClick}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader className="space-y-0 gap-0">
          <div className="bg-destructive w-full">
            <div className="pt-6 pr-6 pl-6 pb-4">
              <AlertDialogTitle className="text-white">Delete {name}?</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="sr-only">Confirm deletion</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-6 pt-3 pb-3 text-sm text-muted-foreground">
          This action cannot be undone and will permanently delete this item.
        </div>
        <AlertDialogFooter className="pr-6 pb-6 pl-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            onClick={() => { onConfirm(); setOpen(false); }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
