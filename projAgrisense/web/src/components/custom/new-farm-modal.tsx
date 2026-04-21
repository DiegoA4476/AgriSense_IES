import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { FieldLabel } from "../ui/field";
import { useState } from "react";
import { useCreateFarm } from "@/hooks/use-farms";

interface NewFarmModalProps {
  farmerId: string;
  onSuccess?: () => void; 
}

// export function NewFarmModal({ farmerId }: NewFarmModalProps) {
export function NewFarmModal({ farmerId, onSuccess }: NewFarmModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [open, setOpen] = useState(false);

  const createFarm = useCreateFarm();

  const handleCreate = async () => {
    try {
      await createFarm.mutateAsync({ name, location, zipcode, farmerId });
      setOpen(false);
      setName("");
      setLocation("");
      setZipcode("");

      onSuccess?.();
    } catch (error) {
      console.error("Failed to create farm:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button 
        className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-700 text-white px-4 py-2.5 h-auto rounded-md transition-colors w-full md:w-auto"
        >
        <Plus className="w-5 h-5" />
        <span className="font-semibold text-[16px] whitespace-nowrap">
            New Farm
        </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader>
            <div className="bg-[#444444] w-full">
            <div className="flex justify-center items-center py-4 px-6">
                <AlertDialogTitle className="text-[#FFFFFF] font-semibold text-center text-xl tracking-wide">
                New Farm
                </AlertDialogTitle>
            </div>
            </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-2 w-full text-[#000000]">
            <div className="flex flex-col gap-1">
                <FieldLabel>Name</FieldLabel>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <FieldLabel>Location</FieldLabel>
                <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <FieldLabel>Zip-Code</FieldLabel>
                <Input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pl-6 pr-6 pb-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-[#16A34A] cursor-pointer"
            onClick={handleCreate}
            disabled={!name || !location || !zipcode || createFarm.isPending}
          >
            {createFarm.isPending ? "Creating..." : "Create"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
