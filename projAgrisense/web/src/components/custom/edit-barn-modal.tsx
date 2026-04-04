import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { useState } from "react";
  import { Input } from "../ui/input";
  import { FieldLabel } from "../ui/field";
  import { Button } from "../ui/button";
  import { SquarePen } from "lucide-react";
  
  interface EditBarnModalProps {
    currentName: string;
    onSave: (newName: string) => void;
  }
  
  export function EditBarnModal({ currentName, onSave }: EditBarnModalProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(currentName);
  
    const handleSave = () => {
      if (!name.trim()) return;
      onSave(name);
      setOpen(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger >
          <button className="inline-flex items-center justify-center rounded-md bg-[#2563EB] p-1.5 hover:bg-blue-700 transition-colors cursor-pointer ml-3">
            <SquarePen className="h-5 w-5 text-white" />
          </button>
        </DialogTrigger>
  
        <DialogContent className="p-0 overflow-hidden border-none max-w-[90vw] sm:max-w-[400px] rounded-lg">
          <DialogHeader className="bg-[#4A4A4A] py-4">
            <DialogTitle className="text-[#FFFFFF] text-center text-xl font-semibold">
              {currentName}
            </DialogTitle>
          </DialogHeader>
  
          <div className="flex flex-col gap-4 p-6 bg-white">
            <div className="flex flex-col gap-1">
              <FieldLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Name
              </FieldLabel>
              <Input
                placeholder="Enter barn name"
                className="bg-[#E5E7EB] border-none h-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
  
            <div className="flex flex-row justify-between w-full gap-4 mt-2">
              <Button
                type="button"
                onClick={() => {
                  setName(currentName);
                  setOpen(false);
                }}
                className="bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white px-8 h-10 flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 h-10 flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }