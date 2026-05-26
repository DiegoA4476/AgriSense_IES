import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export interface CreateFarmRequest {
  name: string;
  location: string;
  zipcode: string;
  farmerId: string;
}

export interface Farm {
  id: number;
  name: string;
  location: string;
  zipcode: string;
  farmerId: string;
}

export function useCreateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFarmRequest) =>
      authFetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`Failed to create farm: ${r.status}`);
        return r.json() as Promise<Farm>;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farms"] }),
  });
}

export function useFarmerFarms() {
  const { data, isLoading } = useQuery<Farm[]>({
    queryKey: ["farms", "mine"],
    queryFn: () => authFetch("/api/farms/me").then((r) => r.json()),
  });
  return { farms: data ?? [], isLoading };
}

export function useUpdateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateFarmRequest }) =>
      authFetch(`/api/farms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`Failed to update farm: ${r.status}`);
        return r.json() as Promise<Farm>;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farms"] }),
  });
}
