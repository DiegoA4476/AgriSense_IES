import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export interface AnimalNotesResponse {
  notes: string;
}

export function useAnimalNotes(animalId: string) {
  return useQuery<AnimalNotesResponse>({
    queryKey: ["animal-notes", animalId],
    queryFn: async () => {
      const response = await authFetch(`/api/animals/${animalId}/notes`);
      if (!response.ok) {
        throw new Error("Failed to load animal notes");
      }
      return response.json();
    },
    enabled: Boolean(animalId),
  });
}

export function useUpdateAnimalNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ animalId, notes }: { animalId: string; notes: string }) => {
      const response = await authFetch(`/api/animals/${animalId}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to save animal notes");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["animal-notes", variables.animalId] });
    },
  });
}