import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
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
  movementData: { bucket: string; total: number }[];
  weightData: { bucket: string; avgWeight: number }[];
}

export function VetModal({ animalId, animalName, temperature, heartRate, stress, notes, movementData, weightData }: VetModalProps) {
  const { data: vetInfo } = useVetInfo(animalId);
  const updateVetInfo = useUpdateVetInfo();
  const notifyVet = useNotifyVet();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

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
      payload: {
        animalName, temperature, heartRate, stress, notes,
        movementData: movementData.map((d) => ({ bucket: d.bucket, value: d.total })),
        weightData: weightData.map((d) => ({ bucket: d.bucket, value: d.avgWeight })),
      },
    });
    setOpen(false);
  }

  return (
    <>
      <Button className="bg-[#16A34A] px-6 py-5 cursor-pointer flex flex-row h-12" onClick={() => setOpen(true)}>
        <Bell height={24} width={14} fill="#FFFFFF" />
        <span className="font-semibold text-[16px] text-[#FFFFFF]">Notify Vet</span>
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="p-0 overflow-hidden">
          <AlertDialogHeader>
            <div className="bg-[#16A34A] w-full">
              <div className="flex flex-row justify-between items-center pt-6 pr-6 pl-6 pb-2">
                <AlertDialogTitle className="text-[#FFFFFF]">Notify Veternary</AlertDialogTitle>
                {!edit ? (
                  <Button variant="outline" onClick={() => setEdit(true)} className="cursor-pointer">Edit</Button>
                ) : (
                  <Button variant="secondary" onClick={handleSave} className="bg-[#DC2626] cursor-pointer font-medium text-[16px] text-[#FFFFFF]">Save</Button>
                )}
              </div>
            </div>
            <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-2 w-full text-[#000000]">
              <div className="flex flex-col gap-1">
                <FieldLabel>Phone Number</FieldLabel>
                <Input disabled={!edit} placeholder="Enter phone number" value={phone} type="tel" onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>E-mail</FieldLabel>
                <Input disabled={!edit} placeholder="Enter e-mail" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pl-6 pr-6 pb-6 flex flex-row justify-between! w-full!">
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <Button className="bg-[#16A34A] cursor-pointer" disabled={edit || !email} onClick={handleNotify}>Notify</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
