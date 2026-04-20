import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteAnimal } from "@/hooks/use-animals";
import type { Animal } from "@/hooks/use-animals";

const animalEmoji: Record<string, string> = {
  pig: "🐷",
  cow: "🐮",
  sheep: "🐑",
  pork: "🐷",
};

export function AnimalCard({ animal }: { animal: Animal }) {
  const animalType = animal.type?.toLowerCase().trim() || "";
  const deleteAnimal = useDeleteAnimal();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm(`Are you sure you want to delete ${animal.name}?`)) {
      deleteAnimal.mutate(animal.id);
    }
  };

  return (
    <Card className="group relative w-37.5 h-37.5 cursor-pointer bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-xl overflow-visible">
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={handleDelete}
        disabled={deleteAnimal.isPending}
      >
        <Trash2 className="h-4 w-4 text-white" />
      </Button>

      <CardContent className="flex flex-col items-center justify-center h-full gap-2 p-0">
        <div className="text-5xl">
          {animalEmoji[animalType] || "🐾"}
        </div>

        <p className="flex justify-center w-full font-semibold text-[18px] text-center truncate px-2 text-black">
          {animal.name}
        </p>
        
        {!(animalType in animalEmoji) && (
           <span className="text-[10px] text-gray-400 absolute bottom-1">
             ({animalType})
           </span>
        )}
      </CardContent>
    </Card>
  );
}