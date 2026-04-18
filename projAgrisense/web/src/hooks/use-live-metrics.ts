import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export function useLiveMetrics(animalId: string) {
  const { data } = useQuery({
    queryKey: ["metrics", "latest", animalId],
    queryFn: () =>
      authFetch(`/api/animals/${animalId}/metrics/latest`).then((r) => r.json()),
    refetchInterval: 3000,
  });
  return (data as Record<string, unknown>) ?? null;
}
