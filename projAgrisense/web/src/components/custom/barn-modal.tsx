import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";
import { FieldLabel } from "../ui/field";

interface BarnModalProps {
  onSubmit: (name: string) => void;
}

export function BarnModal({ onSubmit }: BarnModalProps) {
  const isMobile = useIsMobile();
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState(false);

  function handleSubmit() {
    onSubmit(name);
    setName("");
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button className="bg-[#16A34A] cursor-pointer">
          <Plus />
          {isMobile ? "" : "New Barn"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="space-y-0  gap-0" >
          <div className="bg-[#16A34A] w-full">
            <div className="flex flex-row justify-between items-center pt-6 pr-6 pl-6 pb-4">
              <AlertDialogTitle className="text-white">
                New Barn
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="sr-only">
            Create a new barn
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 px-6 pt-2 pb-4">
          <FieldLabel>Barn Name</FieldLabel>
          <Input
            placeholder="Enter Barn name"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <AlertDialogFooter className="pr-6 pb-6 pl-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#16A34A] cursor-pointer"
            disabled={!name}
            onClick={handleSubmit}
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}