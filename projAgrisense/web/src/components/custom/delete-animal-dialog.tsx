import { Trash2 } from "lucide-react";
import { useDeleteAnimal } from "@/hooks/use-animals";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./delete-dialog";

interface DeleteAnimalDialogProps {
  animalId: number;
  animalName: string;
}

export function DeleteAnimalDialog({ animalId, animalName }: DeleteAnimalDialogProps) {
  const deleteAnimal = useDeleteAnimal();

  return (
    <DeleteDialog
      name={animalName}
      onConfirm={() => deleteAnimal.mutate(animalId)}
      isPending={deleteAnimal.isPending}
      onTriggerClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
      trigger={
        <Button
          variant="destructive"
          size="icon"
          className="absolute cursor-pointer -top-2 -right-2 h-8 w-8 rounded-full shadow-md z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      }
    />
  );
}
