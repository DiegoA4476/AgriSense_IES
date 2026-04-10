import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Barn { id: number; name: string; }

export function useBarns() {
  const { data } = useQuery<Barn[]>({
    queryKey: ["barns"],
    queryFn: () => fetch("/api/barns").then((r) => r.json()),
  });
  return (data as Barn[]) ?? [];
}

export function useCreateBarn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      fetch("/api/barns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barns"] }),
  });
}

export function useDeleteBarn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/barns/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error(`Failed to delete barn: ${r.status}`);
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barns"] }),
  });
}
