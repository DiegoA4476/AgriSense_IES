import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export interface Barn {
  id: number;
  name: string;
  farmId?: number;
}

export function useBarns() {
  const { data } = useQuery<Barn[]>({
    queryKey: ["barns"],
    queryFn: () => authFetch("/api/barns").then((r) => r.json()),
  });
  return (data as Barn[]) ?? [];
}

export function useBarnsByFarm(farmId: number) {
  const { data } = useQuery<Barn[]>({
    queryKey: ["barns", "farm", farmId],
    queryFn: () => authFetch(`/api/barns?farmId=${farmId}`).then((r) => r.json()),
    enabled: !!farmId,
  });
  return (data as Barn[]) ?? [];
}

export function useCreateBarn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, farmId }: { name: string; farmId?: number }) =>
      authFetch("/api/barns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, farmId }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barns"] }),
  });
}

export function useDeleteBarn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      authFetch(`/api/barns/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error(`Failed to delete barn: ${r.status}`);
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barns"] }),
  });
}

export function useUpdateBarn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await authFetch(`/api/barns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to update barn");
      return response.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barns"] }),
  });
}
