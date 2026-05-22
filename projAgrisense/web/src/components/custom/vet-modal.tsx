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
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { FieldLabel } from "../ui/field";
import { useVetInfo, useUpdateVetInfo, useNotifyVet } from "@/hooks/use-vet-info";

interface VetModalProps {
  animalId: string;
  animalName: string;
  temperature: string;
  heartRate: string;
  stress: string;
  notes: string;
}

export function VetModal({ animalId, animalName, temperature, heartRate, stress, notes }: VetModalProps) {
  const { data: vetInfo } = useVetInfo(animalId);
  const updateVetInfo = useUpdateVetInfo();
  const notifyVet = useNotifyVet();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (vetInfo) {
      setEmail(vetInfo.vetEmail ?? "");
      setPhone(vetInfo.vetPhone ?? "");
    }
  }, [vetInfo]);

  function handleSave() {
    updateVetInfo.mutate({ animalId, vetInfo: { vetEmail: email, vetPhone: phone } });
    setEdit(false);
  }

  function handleNotify() {
    notifyVet.mutate({
      animalId,
      payload: { animalName, temperature, heartRate, stress, notes },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-[#16A34A] px-6 py-5 cursor-pointer flex flex-row h-12">
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
                <Button
                  variant="outline"
                  onClick={() => setEdit(true)}
                  className="cursor-pointer"
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleSave}
                  className="bg-[#DC2626] cursor-pointer font-medium text-[16px] text-[#FFFFFF]"
                >
                  Save
                </Button>
              )}
            </div>
          </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-2 w-full text-[#000000]">
            <div className="flex flex-col gap-1">
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter phone number"
                value={phone}
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>E-mail</FieldLabel>
              <Input
                disabled={!edit}
                placeholder="Enter e-mail"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
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
            disabled={edit || !email}
            onClick={handleNotify}
          >
            Notify
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
