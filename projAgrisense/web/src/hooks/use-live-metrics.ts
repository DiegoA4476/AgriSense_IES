import { useQuery } from "@tanstack/react-query";

export function useLiveMetrics(animalId: string) {
  const { data } = useQuery({
    queryKey: ["metrics", "latest", animalId],
    queryFn: () =>
      fetch(`/api/animals/${animalId}/metrics/latest`).then((r) => r.json()),
    refetchInterval: 3000,
  });
  return (data as Record<string, unknown>) ?? null;
}
