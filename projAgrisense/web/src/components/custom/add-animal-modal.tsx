import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div className="cursor-pointer">
          <AddAnimalCard />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="space-y-0 gap-0">
          <div className="bg-[#16A34A] w-full">
            <div className="pt-6 pr-6 pl-6 pb-4">
              <AlertDialogTitle className="text-white">
                Add Animal
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="sr-only">
            Add a new animal
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 px-6 pt-4 pb-2">
          <div className="flex flex-col gap-1">
            <FieldLabel>Name</FieldLabel>
            <Input
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Species</FieldLabel>
            <Select
              value={formData.species}
              onValueChange={(value) => value && setFormData({ ...formData, species: value })}
            >
              <SelectTrigger className="w-full">
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
            <FieldLabel>Weight</FieldLabel>
            <Input
              type="number"
              placeholder="0"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Height</FieldLabel>
            <Input
              type="number"
              placeholder="0"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
          </div>
        </div>

        <AlertDialogFooter className="px-6 pb-6 pt-2 flex flex-row justify-between! w-full!">
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCreate}
            disabled={!formData.name}
            className="bg-[#16A34A] cursor-pointer"
          >
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
