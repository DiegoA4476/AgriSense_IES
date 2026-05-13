import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export interface Animal {
  id: number;
  name: string;
  type: string;
  weight: number;
  height: number;
  barnId: number;
  simulatorId?: string;
}

export function useAnimals(barnId: number) {
  return useQuery<Animal[]>({
    queryKey: ["animals", barnId],
    queryFn: async () => {
      const response = await authFetch(`/api/barns/${barnId}/animals`);
      if (!response.ok) throw new Error("Failed to fetch animals");
      return response.json();
    },
    enabled: !!barnId,
  });
}

export function useCreateAnimal() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (newAnimal: Omit<Animal, "id">) => {
      const response = await authFetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAnimal.name,
          type: newAnimal.type.toLowerCase(), 
          weight: Number(newAnimal.weight),
          height: Number(newAnimal.height),
          barnId: newAnimal.barnId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating animal");
      }

      return response.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["animals", data.barnId] });
    },
  });
}

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (animalId: number) => {
      const response = await authFetch(`/api/animals/${animalId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete the animal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animals"] });
    },
  });
}