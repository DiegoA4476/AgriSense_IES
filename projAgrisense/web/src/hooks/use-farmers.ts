import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export interface CreateFarmerRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateFarmerResponse {
  userId: string;
  username: string;
  temporaryPassword: string;
}

export function useCreateFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFarmerRequest) =>
      authFetch("/api/farmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`Failed to create farmer: ${r.status}`);
        return r.json() as Promise<CreateFarmerResponse>;
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farmers"] }),
  });
}
