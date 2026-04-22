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
import { authFetch } from "@/lib/api";

interface ViewFarmerModalProps {
  farmer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  onSave?: () => void;
}

export function ViewFarmerModal({ farmer, onSave }: ViewFarmerModalProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    first_name: farmer?.first_name || "",
    last_name: farmer?.last_name || "",
    email: farmer?.email || "",
  });

  const [prevFarmerId, setPrevFarmerId] = useState(farmer?.id);
  if (farmer?.id !== prevFarmerId) {
    setPrevFarmerId(farmer?.id);
    setFormData({
      first_name: farmer?.first_name || "",
      last_name: farmer?.last_name || "",
      email: farmer?.email || "",
    });
    setEdit(false);
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!farmer) return;

    try {
      setIsPending(true);
      await authFetch(`/api/manager/farmers/${farmer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.first_name,
          lastName: formData.last_name,
        }),
      });

      setEdit(false);
      
      setTimeout(() => {
        onSave?.();
      }, 500);
    } catch (error) {
      console.error("Failed to update farmer:", error);
      alert("Failed to save changes.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!farmer) return;

    if (!window.confirm("Are you sure you want to delete this farmer? This cannot be undone.")) {
      return;
    }

    try {
      setIsPending(true);
      await authFetch(`/api/manager/farmers/${farmer.id}`, {
        method: "DELETE",
      });

      onSave?.(); 
    } catch (error) {
      console.error("Failed to delete farmer:", error);
      alert("Failed to delete farmer.");
    } finally {
      setIsPending(false);
    }
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
          <div className="bg-[#444444] w-full relative">
            
            <div className="flex justify-center items-center py-4 px-6 gap-4">
              <AlertDialogTitle className="text-[#FFFFFF] font-semibold text-center text-xl tracking-wide">
                Farmer Details
              </AlertDialogTitle>
              {!edit ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(true);
                  }}
                  className="bg-[#3b82f6] hover:bg-blue-700 text-white p-1.5 rounded cursor-pointer transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(false);
                  }}
                  className="bg-[#ef4444] hover:bg-red-600 text-white p-1.5 rounded cursor-pointer transition-colors"
                >
                  <PencilOff className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <AlertDialogCancel
                  onClick={() => setEdit(false)}
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
                disabled={true}
                title="Emails cannot be changed after creation."
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
          {edit && (
            <Button 
              variant="outline"
              className="cursor-pointer mt-2 sm:mt-0"
              onClick={() => {
                setFormData({
                  first_name: farmer?.first_name || "",
                  last_name: farmer?.last_name || "",
                  email: farmer?.email || "",
                });
                setEdit(false);
              }}
            >
              Cancel
            </Button>
          )}
          {edit && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-[#ef4444] hover:bg-red-600 text-white"
            >
              {isPending ? "..." : "Delete"}
            </AlertDialogAction>
          )}
          {edit && (
            <AlertDialogAction
              onClick={handleSave}
              disabled={isPending}
              className="bg-[#16A34A] cursor-pointer"
            >
              {isPending ? "Saving..." : "Save"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}