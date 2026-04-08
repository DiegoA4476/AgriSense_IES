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

export function NewFarmerModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button 
        className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-700 text-white px-4 py-2.5 h-auto rounded-md transition-colors w-full md:w-auto"
        >
        <Plus className="w-5 h-5" />
        <span className="font-semibold text-[16px] whitespace-nowrap">
            New Farmer
        </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader>
            <div className="bg-[#444444] w-full">
            <div className="flex justify-center items-center py-4 px-6">
                <AlertDialogTitle className="text-[#FFFFFF] font-semibold text-center text-xl tracking-wide">
                New Farmer
                </AlertDialogTitle>
            </div>
            </div>
          <AlertDialogDescription className="flex flex-col gap-3 pl-6 pr-6 pt-2 w-full text-[#000000]">
            <div className="flex flex-col gap-1">
                <FieldLabel>First Name</FieldLabel>
                <Input
                    type="text"
                >
                </Input>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                    type="text"
                >
                </Input>
                <FieldLabel>E-mail</FieldLabel>
                <Input
                    type="email"
                >
                </Input>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pl-6 pr-6 pb-6 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>

          {/* O botão não faz nada, para fechar o modal é preciso clicar em cancelar não sabia como o havia de deixar agora por ser estático mas yah */}
          <AlertDialogAction className="bg-[#16A34A] cursor-pointer">
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
