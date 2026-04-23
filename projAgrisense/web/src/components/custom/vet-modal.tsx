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
import { Bell } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { FieldLabel } from "../ui/field";

export function VetModal() {
  const [vet, setVet] = useState<{
    phone: number | undefined;
    email: string | undefined;
  }>();
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-[#16A34A] absolute left-0 px-6 py-5 cursor-pointer flex flex-row h-12">
          <Bell height={24} width={14} fill="#FFFFFF" />
          <span className="font-semibold text-[16px] text-[#FFFFFF]">
            Notify Vet
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader>
          <div className="bg-[#16A34A] w-full">
            <div className="flex flex-row justify-between items-center pt-6 pr-6 pl-6 pb-2">
              <AlertDialogTitle className="text-[#FFFFFF]">
                Notify Veternary
              </AlertDialogTitle>
              {!edit ? (
                <AlertDialogAction
                  variant="outline"
                  onClick={() => setEdit(true)}
                  className="cursor-pointer"
                >
                  Edit
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  variant="secondary"
                  onClick={() => setEdit(false)}
                  className="bg-[#DC2626] cursor-pointer font-medium text-[16px] text-[#FFFFFF]"
                >
                  Save
                </AlertDialogAction>
              )}
            </div>
          </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-2 w-full text-[#000000]">
            <div className="flex flex-col gap-1">
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter phone number"
                value={vet?.phone ?? undefined}
                type="number"
                onChange={(e) =>
                  setVet((prev) => ({
                    ...prev,
                    phone: Number(e.target.value),
                    email: prev?.email ?? undefined,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>E-mail</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter e-mail"
                value={vet?.email ?? ""}
                type="string"
                onChange={(e) =>
                  setVet((prev) => ({
                    ...prev,
                    email: e.target.value,
                    phone: prev?.phone ?? undefined,
                  }))
                }
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
            disabled={edit || !vet?.phone || !vet?.email}
          >
            Notify
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
