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
import { useUpdateFarm } from "@/hooks/use-farms";

interface ViewFarmModalProps {
  farm?: {
    id: number;
    name: string;
    location: string;
    zipcode: string;
    farmerId: string;
  };
  onSave?: (updatedFarm: { id: number; name: string; location: string; zipcode: string }) => void;
}

export function ViewFarmModal({ farm, onSave }: ViewFarmModalProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: farm?.name || "",
    location: farm?.location || "",
    zipcode: farm?.zipcode || "",
  });

  const updateFarm = useUpdateFarm();

  const [prevFarmId, setPrevFarmId] = useState(farm?.id);
  if (farm?.id !== prevFarmId) {
    setPrevFarmId(farm?.id);
    setFormData({
      name: farm?.name || "",
      location: farm?.location || "",
      zipcode: farm?.zipcode || "",
    });
    setEdit(false);
  }

  const handleSave = async () => {
    if (farm) {
      try {
        await updateFarm.mutateAsync({
          id: farm.id,
          data: { ...formData, farmerId: farm.farmerId },
        });
        if (onSave) {
          onSave({ id: farm.id, ...formData });
        }
        setEdit(false);
      } catch (error) {
        console.error("Failed to update farm:", error);
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#3b82f6] hover:bg-blue-50 cursor-pointer">
          <Eye className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader>
          <div className="bg-[#16A34A] w-full relative">
            <div className="flex items-center pt-6 pr-6 pl-6 pb-4 gap-4">
              <AlertDialogTitle className="text-white flex-1">
                Farm Details
              </AlertDialogTitle>
              {!edit ? (
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(true);
                  }}
                  className="bg-white/20 hover:bg-white/30 cursor-pointer"
                >
                  <Pencil/>
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(false);
                  }}
                  className="bg-white/20 hover:bg-white/30 cursor-pointer"
                >
                  <PencilOff/>
                </AlertDialogAction>
              )}
              <AlertDialogCancel
                onClick={(e) => {
                  e.preventDefault();
                  setEdit(false);
                }}
                className="bg-white/20 hover:bg-white/30 text-white border-0 w-8 h-8 p-0 flex items-center justify-center">
                <X className="w-5 h-5" />
              </AlertDialogCancel>
            </div>
          </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-6 w-full text-[#000000]">
            <div className="flex flex-col gap-1">
              <FieldLabel>Name</FieldLabel>
              <Input
                disabled={!edit}
                value={formData.name}
                type="text"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Location</FieldLabel>
              <Input
                disabled={!edit}
                value={formData.location}
                type="text"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Zip-Code</FieldLabel>
              <Input
                disabled={!edit}
                value={formData.zipcode}
                type="text"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    zipcode: e.target.value,
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
                name: farm?.name || "",
                location: farm?.location || "",
                zipcode: farm?.zipcode || "",
                });
                setEdit(false);
              }}
            >
              Cancel
            </Button>
          )}
          {edit && (
            <AlertDialogAction
              onClick={handleSave}
              className="bg-[#16A34A] cursor-pointer"
              disabled={updateFarm.isPending}
            >
              {updateFarm.isPending ? "Saving..." : "Save"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}