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
import { Eye, Pencil, PencilOff, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { FieldLabel } from "../ui/field";

interface ViewFarmerModalProps {
  farmer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  onSave?: (updatedFarmer: { id: number; first_name: string; last_name: string; email: string }) => void;
}

export function ViewFarmerModal({ farmer, onSave }: ViewFarmerModalProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    first_name: farmer?.first_name || "",
    last_name: farmer?.last_name || "",
    email: farmer?.email || "",
  });

  // Update form data when farmer prop changes
  const [prevFarmerId, setPrevFarmerId] = useState(farmer?.id);
  if (farmer?.id !== prevFarmerId) {
    setPrevFarmerId(farmer?.id);
    setFormData({
      first_name: farmer?.first_name || "",
      last_name: farmer?.last_name || "",
      email: farmer?.email || "",
    });
    setEdit(false); // Reset edit mode when farmer changes
  }

  const handleSave = () => {
    if (farmer && onSave) {
      onSave({
        id: farmer.id,
        ...formData,
      });
    }
    setEdit(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button 
          className="bg-[#3b82f6] hover:bg-blue-700 text-white w-8 h-8 p-0 flex items-center justify-center rounded transition-colors"
        >
          <Eye className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader>
          {/* 1. Add "relative" to the main wrapper */}
          <div className="bg-[#444444] w-full relative">
            
            {/* This center div stays exactly the same */}
            <div className="flex justify-center items-center py-4 px-6 gap-4">
              <AlertDialogTitle className="text-[#FFFFFF] font-semibold text-center text-xl tracking-wide">
                Farmer Details
              </AlertDialogTitle>
              {!edit ? (
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault(); // See note below!
                    setEdit(true);
                  }}
                  className="bg-[#3b82f6] hover:bg-blue-700 cursor-pointer"
                >
                  <Pencil/>
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(false);
                  }}
                  className="bg-[#ef4444] hover:bg-red-600 cursor-pointer"
                >
                  <PencilOff/>
                </AlertDialogAction>
              )}
            </div>

            {/* 2. Wrap the X in an absolutely positioned div */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <AlertDialogCancel
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(false);
                  }}
                  className="bg-[#ef4444] hover:bg-red-600 text-white border-0 w-8 h-8 p-0 flex items-center justify-center">
                <X className="w-5 h-5" />
              </AlertDialogCancel>
            </div>

          </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-6 w-full text-[#000000]">
            <div className="flex flex-col gap-1">
              <FieldLabel>First Name</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter first name"
                value={formData.first_name}
                type="text"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Last Name</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter last name"
                value={formData.last_name}
                type="text"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>E-mail</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter e-mail"
                value={formData.email}
                type="email"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pl-6 pr-6 pb-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel 
            className="cursor-pointer"
            onClick={() => {
              // Reset form data and edit mode when canceling
              setFormData({
                first_name: farmer?.first_name || "",
                last_name: farmer?.last_name || "",
                email: farmer?.email || "",
              });
              setEdit(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          {edit && (
            <AlertDialogAction
              onClick={handleSave}
              className="bg-[#16A34A] cursor-pointer"
            >
              Save
            </AlertDialogAction>
          )}
          {!edit && (
            <AlertDialogAction className="bg-[#16A34A] cursor-pointer">
              Close
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}