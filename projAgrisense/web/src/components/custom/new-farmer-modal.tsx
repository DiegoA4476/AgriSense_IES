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
import { useCreateFarmer } from "@/hooks/use-farmers";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewFarmerModalProps {
  onSuccess?: () => void;
}

export function NewFarmerModal({ onSuccess }: NewFarmerModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const isMobile = useIsMobile();

  const createFarmer = useCreateFarmer();

  const handleCreate = async () => {
    try {
      const response = await createFarmer.mutateAsync({
        firstName,
        lastName,
        email,
      });
      setPassword(response.temporaryPassword);
      setShowPassword(true);
    } catch (error) {
      console.error("Failed to create farmer:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowPassword(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");

    onSuccess?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-700 text-white px-4 py-2.5 h-auto rounded-md transition-colors w-full md:w-auto cursor-pointer">
          <Plus />
          {isMobile ? "" : "New Farmer"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader>
          <div className="bg-[#16A34A] w-full">
            <div className="pt-6 pr-6 pl-6 pb-4">
              <AlertDialogTitle className="text-white">
                {showPassword ? "Farmer Created" : "New Farmer"}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-2 w-full text-[#000000]">
            {showPassword ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm">
                  Farmer created successfully. Please provide this temporary
                  password to the farmer:
                </p>
                <div className="bg-gray-100 p-4 rounded border border-gray-300">
                  <p className="font-mono text-lg font-bold text-center break-all">
                    {password}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  The farmer will be required to change this password on first
                  login.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <FieldLabel>First Name</FieldLabel>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <FieldLabel>E-mail</FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pl-6 pr-6 pb-6 flex flex-row justify-between! w-full!">
          {showPassword ? (
            <AlertDialogAction
              onClick={handleClose}
              className="w-full bg-[#16A34A] cursor-pointer"
            >
              Close
            </AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={handleClose}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#16A34A] cursor-pointer"
                onClick={handleCreate}
                disabled={
                  !firstName || !lastName || !email || createFarmer.isPending
                }
              >
                {createFarmer.isPending ? "Creating..." : "Create"}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
