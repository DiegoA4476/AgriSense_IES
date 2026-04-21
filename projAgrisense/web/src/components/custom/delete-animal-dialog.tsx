import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteAnimal } from "@/hooks/use-animals";
import { Button } from "@/components/ui/button";
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

interface DeleteAnimalDialogProps {
  animalId: number;
  animalName: string;
}

export function DeleteAnimalDialog({ animalId, animalName }: DeleteAnimalDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteAnimal = useDeleteAnimal();

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAnimal.mutate(animalId, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger >
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={handleOpen}
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle> Delete <strong>{animalName}</strong>?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The animal will be permanently deleted from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={deleteAnimal.isPending}
          >
            {deleteAnimal.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}