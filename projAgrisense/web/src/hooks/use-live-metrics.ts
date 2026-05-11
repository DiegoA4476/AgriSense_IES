import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

function useMetric<T>(animalId: string, metric: string) {
  const { data } = useQuery<T>({
    queryKey: ["metrics", metric, animalId],
    queryFn: () =>
      authFetch(`/api/animals/${animalId}/metrics/${metric}`).then((r) => r.json()),
    refetchInterval: 3000,
  });
  return data ?? null;
}

export const useHeartRate  = (id: string) => useMetric<{ heartRate: number }>(id, "heart-rate");
export const useTemperature = (id: string) => useMetric<{ temperature: number }>(id, "temperature");
export const useStress      = (id: string) => useMetric<{ stress: number }>(id, "stress");
export const useMovement    = (id: string) => useMetric<{ movement: number }>(id, "movement");
