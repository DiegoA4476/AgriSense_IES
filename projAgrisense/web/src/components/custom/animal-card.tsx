import { Card, CardContent } from "@/components/ui/card";
import type { Animal } from "@/hooks/use-animals"; 

const animalEmoji: Record<string, string> = {
  pig: "🐷", 
  cow: "🐮",
  sheep: "🐑",
  pork: "🐷", 
};

export function AnimalCard({ animal }: { animal: Animal }) {
  const animalType = animal.type.toLowerCase();

  return (
    <Card
      className="w-37.5 h-37.5 cursor-pointer 
      bg-card border border-border 
      hover:shadow-lg hover:-translate-y-1 
      transition-all duration-200 rounded-xl"
    >
      <CardContent className="flex flex-col items-center justify-center h-full gap-2">
        <div className="text-5xl">
          {animalEmoji[animalType] || "🐾"}
        </div>

        <p className="flex justify-center w-full font-semibold text-[18px] text-center truncate px-2 text-black">
          {animal.name}
        </p>
      </CardContent>
    </Card>
  );
}