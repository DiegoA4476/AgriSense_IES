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
import { AddAnimalCard } from "./add-animal-card";
import { ChevronDown } from "lucide-react";

interface AddAnimalModalProps {
  onAdd: (animal: { name: string; type: string; weight: number; height: number }) => void;
}

export function AddAnimalModal({ onAdd }: AddAnimalModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "pork", 
    weight: "",
    height: "",
  });

  const handleCreate = () => {
    if (!formData.name) return;

    onAdd({
      name: formData.name,
      type: formData.species,
      weight: Number(formData.weight) || 0,
      height: Number(formData.height) || 0,
    });
    
    setFormData({ name: "", species: "pork", weight: "", height: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="cursor-pointer">
          <AddAnimalCard />
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden border-none max-w-[95vw] sm:max-w-[400px] rounded-lg">
        <DialogHeader className="bg-[#4A4A4A] py-4">
          <DialogTitle className="text-[#FFFFFF] text-center text-xl font-semibold">
            Add Animal
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6 bg-white">
          <div className="flex flex-col gap-1">
            <FieldLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Name
            </FieldLabel>
            <Input
              placeholder="Enter name"
              className="bg-[#E5E7EB] border-none h-10 text-black"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Species
            </FieldLabel>
            <div className="relative w-full">
              <select
                className="flex h-10 w-full rounded-md bg-[#E5E7EB] px-3 py-2 text-sm focus:outline-none border-none appearance-none cursor-pointer pr-10 text-black"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              >
                <option value="pork">Pork</option>
                <option value="cow">Cow</option>
                <option value="sheep">Sheep</option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Weight
            </FieldLabel>
            <Input
              type="number"
              placeholder="0"
              className="bg-[#E5E7EB] border-none h-10 text-black"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Height
            </FieldLabel>
            <Input
              type="number"
              placeholder="0"
              className="bg-[#E5E7EB] border-none h-10 text-black"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
          </div>

          <div className="flex flex-row justify-between w-full gap-4 mt-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-[#4A4A4A] hover:bg-[#3A3A3A] text-white px-8 h-10 flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={!formData.name}
              className="bg-[#16A34A] hover:bg-[#15803d] text-white px-8 h-10 flex-1"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}