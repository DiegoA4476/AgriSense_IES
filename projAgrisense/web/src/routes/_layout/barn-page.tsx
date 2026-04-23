import { createFileRoute } from "@tanstack/react-router";
import { AnimalCard } from "@/components/custom/animal-card";
import { AddAnimalModal } from "@/components/custom/add-animal-modal";
import { EditBarnModal } from "@/components/custom/edit-barn-modal";
import { useAnimals, useCreateAnimal } from "@/hooks/use-animals";
import { useBarns, useUpdateBarn } from "@/hooks/use-barns";

export const Route = createFileRoute("/_layout/barn-page")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: Number(search.id) || 0,
    };
  },
  component: BarnPage,
});

function BarnPage() {
  const { id: barnId } = Route.useSearch();

  const { data: animals = [], isLoading: loadingAnimals } = useAnimals(barnId);
  const barns = useBarns();
  const currentBarn = barns.find((b) => b.id === barnId);

  const createAnimalMutation = useCreateAnimal();
  const updateBarnMutation = useUpdateBarn();

  const handleAddAnimal = (animalData: any) => {
    createAnimalMutation.mutate({
      name: animalData.name,
      type: animalData.type,
      weight: Number(animalData.weight),
      height: Number(animalData.height),
      barnId: barnId,
    });
  };

  const handleUpdateBarn = (newName: string) => {
    updateBarnMutation.mutate({
      id: barnId,
      name: newName,
    });
  };

  if (loadingAnimals && animals.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-lg animate-pulse text-zinc-500">
          Loading barn data...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 overflow-auto h-full">
      <div className="flex justify-center items-center w-full mb-6 sm:mb-8 gap-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
          {currentBarn?.name || "Loading..."}
        </h1>

        {currentBarn && (
          <EditBarnModal
            currentName={currentBarn.name}
            onSave={handleUpdateBarn}
          />
        )}
      </div>

      <div className="grid justify-items-center gap-4 grid-cols-2 md:grid-cols-4">
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}

        <AddAnimalModal onAdd={handleAddAnimal} />
      </div>

      {(createAnimalMutation.isPending || updateBarnMutation.isPending) && (
        <div className="fixed bottom-6 right-6 bg-[#16A34A] text-white px-6 py-3 rounded-full shadow-2xl animate-bounce flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          Saving changes...
        </div>
      )}
    </div>
  );
}
