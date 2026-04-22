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
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { SquarePen } from "lucide-react";
import { useState } from "react";

interface EditBarnModalProps {
  currentName: string;
  onSave: (newName: string) => void;
}

export function EditBarnModal({ currentName, onSave }: EditBarnModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);

  function handleSave() {
    if (!name.trim()) return;
    onSave(name);
    setOpen(false);
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setName(currentName);
      }}
    >
      <AlertDialogTrigger>
        <Button
          size="icon"
          className="h-8 w-8 bg-[#2563EB] hover:bg-blue-700 cursor-pointer"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="space-y-0 gap-0">
          <div className="bg-[#2563EB] w-full">
            <div className="pt-6 pr-6 pl-6 pb-4">
              <AlertDialogTitle className="text-white">
                Edit Barn
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="sr-only">
            Edit barn name
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2 px-6 pt-2 pb-4">
          <FieldLabel>Barn Name</FieldLabel>
          <Input
            placeholder="Enter barn name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <AlertDialogFooter className="pr-6 pb-6 pl-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#2563EB] hover:bg-blue-700 cursor-pointer"
            disabled={!name.trim()}
            onClick={handleSave}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
