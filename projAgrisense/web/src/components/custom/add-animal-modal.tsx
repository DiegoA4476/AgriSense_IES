import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AddAnimalCard } from "@/components/custom/add-animal-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      <DialogContent className="gap-4! p-0 overflow-hidden border-none max-w-[95vw] sm:max-w-[calc(100vw / 1.2)] rounded-lg" showCloseButton={false}>
        <DialogHeader className="bg-[#16A34A] py-4 relative">
          <DialogTitle className="text-[#FFFFFF] text-center text-xl font-semibold">
            Add Animal
          </DialogTitle>
          <DialogClose className="absolute top-1/2 -translate-y-1/2 right-4 text-white opacity-70 hover:opacity-100 cursor-pointer">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 pt-4 pb-2 bg-white">
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
            <Select
              value={formData.species}
              onValueChange={(value) => value && setFormData({ ...formData, species: value })}
            >
              <SelectTrigger className="bg-[#E5E7EB] border-none h-10 text-black w-full">
                <SelectValue className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pork">Pork</SelectItem>
                <SelectItem value="cow">Cow</SelectItem>
                <SelectItem value="sheep">Sheep</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        <DialogFooter className="px-6 pb-6 pt-2 flex flex-row justify-between! w-full!">
          <DialogClose render={<Button variant="outline" className="cursor-pointer" />}>
            Cancel
          </DialogClose>
          <Button
            onClick={handleCreate}
            disabled={!formData.name}
            className="bg-[#16A34A] hover:bg-[#15803d] cursor-pointer"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
