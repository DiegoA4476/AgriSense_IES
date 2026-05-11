import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export function useMovementHistory(animalId: string, from: string, to: string) {
  const { data } = useQuery({
    queryKey: ["movement-history", animalId, from, to],
    queryFn: () =>
      authFetch(`/api/animals/${animalId}/metrics/movement/history?from=${from}&to=${to}`).then((r) => r.json()),
  });
  return (data as unknown[]) ?? [];
}

export function useWeightHistory(animalId: string, from: string, to: string) {
  const { data } = useQuery({
    queryKey: ["weight-history", animalId, from, to],
    queryFn: () =>
      authFetch(`/api/animals/${animalId}/metrics/weight/history?from=${from}&to=${to}`).then((r) => r.json()),
  });
  return (data as unknown[]) ?? [];
}
