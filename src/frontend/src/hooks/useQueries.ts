import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bill } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllBills() {
  const { actor, isFetching } = useActor();
  return useQuery<Bill[]>({
    queryKey: ["bills"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBills();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalBillCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["bill-count"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalBillCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalSalesAmount() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["total-sales"],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getTotalSalesAmount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveBill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      customerName: string;
      powderCost: number;
      gasCost: number;
      labourCost: number;
      taxRate: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveBill(
        params.customerName,
        params.powderCost,
        params.gasCost,
        params.labourCost,
        params.taxRate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-count"] });
      queryClient.invalidateQueries({ queryKey: ["total-sales"] });
    },
  });
}
