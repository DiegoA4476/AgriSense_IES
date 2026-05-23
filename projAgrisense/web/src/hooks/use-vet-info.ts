import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export interface VetInfo {
  vetEmail: string | null;
  vetPhone: string | null;
}

export interface ChartPoint {
  bucket: string;
  value: number;
}

export interface NotifyVetPayload {
  animalName: string;
  temperature: string;
  heartRate: string;
  stress: string;
  notes: string;
  movementData?: ChartPoint[];
  weightData?: ChartPoint[];
}

export function useVetInfo(animalId: string) {
  return useQuery<VetInfo>({
    queryKey: ["vet-info", animalId],
    queryFn: async () => {
      const res = await authFetch(`/api/animals/${animalId}/vet`);
      if (!res.ok) throw new Error("Failed to fetch vet info");
      return res.json();
    },
    enabled: Boolean(animalId),
  });
}

export function useUpdateVetInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ animalId, vetInfo }: { animalId: string; vetInfo: VetInfo }) => {
      const res = await authFetch(`/api/animals/${animalId}/vet`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vetInfo),
      });
      if (!res.ok) throw new Error("Failed to update vet info");
      return res.json();
    },
    onSuccess: (_, { animalId }) => {
      qc.invalidateQueries({ queryKey: ["vet-info", animalId] });
    },
  });
}

export function useNotifyVet() {
  return useMutation({
    mutationFn: async ({ animalId, payload }: { animalId: string; payload: NotifyVetPayload }) => {
      const res = await authFetch(`/api/animals/${animalId}/notify-vet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to notify vet");
    },
  });
}
