import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export function useMovementHistory(animalId: string) {
  const { data } = useQuery({
    queryKey: ["movement-history", animalId],
    queryFn: () => {
      const to = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const from = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      return authFetch(`/api/animals/${animalId}/metrics/movement/history?from=${from}&to=${to}`).then((r) => r.json());
    },
    refetchInterval: 3000,
  });
  return (data as unknown[]) ?? [];
}

export function useWeightHistory(animalId: string) {
  const { data } = useQuery({
    queryKey: ["weight-history", animalId],
    queryFn: () => {
      const to = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const from = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      return authFetch(`/api/animals/${animalId}/metrics/weight/history?from=${from}&to=${to}`).then((r) => r.json());
    },
    refetchInterval: 60000,
  });
  return (data as unknown[]) ?? [];
}
