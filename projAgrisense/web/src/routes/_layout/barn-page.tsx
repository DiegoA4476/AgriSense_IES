import { useState } from "react"; // 1. Importar useState
import { createFileRoute } from "@tanstack/react-router";
import { AnimalCard } from "@/components/custom/animal-card";
import { AddAnimalModal } from "@/components/custom/add-animal-modal"; 
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/_layout/barn-page")({
  component: BarnPage,
});

function BarnPage() {
  const isMobile = useIsMobile();

  const [animals, setAnimals] = useState([
    { id: "1", name: "Pork 1", type: "pork" },
    { id: "2", name: "Cow 1", type: "cow" },
    { id: "3", name: "Pork 2", type: "pork" },
    { id: "4", name: "Sheep 1", type: "sheep" },
    { id: "5", name: "Cow 2", type: "cow" },
    { id: "6", name: "Pork 3", type: "pork" },
  ]);

  const handleAddAnimal = (newAnimal: { id: string; name: string; type: string }) => {
    setAnimals((prev) => [...prev, newAnimal]);
  };

  return (
    <div className="p-4 sm:p-8 overflow-auto h-full">
      <div className="flex justify-center w-full mb-6 sm:mb-8">
        <span className="text-4xl sm:text-5xl font-bold text-center">
          Barn 1
        </span>
      </div>

      <div
        className={`grid gap-4 sm:gap-6 justify-items-center ${
          isMobile
            ? "grid-cols-1"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        }`}
      >

        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}

        <AddAnimalModal onAdd={handleAddAnimal} />
      </div>
    </div>
  );
}