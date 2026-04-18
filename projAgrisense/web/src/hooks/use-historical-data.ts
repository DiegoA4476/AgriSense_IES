import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export function useMovement(animalId: string, from: string, to: string) {
  const { data } = useQuery({
    queryKey: ["movement", animalId, from, to],
    queryFn: () =>
      authFetch(`/api/animals/${animalId}/movement?from=${from}&to=${to}`).then((r) => r.json()),
  });
  return (data as unknown[]) ?? [];
}

export function useWeight(animalId: string, from: string, to: string) {
  const { data } = useQuery({
    queryKey: ["weight", animalId, from, to],
    queryFn: () =>
      authFetch(`/api/animals/${animalId}/weight?from=${from}&to=${to}`).then((r) => r.json()),
  });
  return (data as unknown[]) ?? [];
}
