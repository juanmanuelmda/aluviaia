import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ALL_KEYS } from "@/lib/data";
import { demoStatus, loadDemoData, removeDemoData, resetDemoData } from "@/lib/demo.functions";

export const DEMO_KEY = ["demo-status"];

export function useDemoStatus() {
  const status = useServerFn(demoStatus);
  return useQuery({
    queryKey: DEMO_KEY,
    queryFn: () => status({ data: undefined }),
  });
}

/** Muestra "MODO DEMO" sólo cuando hay registros marcados como demostración. */
export function useDemoMode() {
  const { data } = useDemoStatus();
  return Boolean(data?.loaded);
}

export function useDemoAction(kind: "load" | "remove" | "reset") {
  const qc = useQueryClient();
  const load = useServerFn(loadDemoData);
  const remove = useServerFn(removeDemoData);
  const reset = useServerFn(resetDemoData);
  return useMutation({
    mutationFn: async () => {
      if (kind === "load") return load({ data: undefined });
      if (kind === "remove") return remove({ data: undefined });
      return reset({ data: undefined });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEMO_KEY });
      for (const key of ALL_KEYS) qc.invalidateQueries({ queryKey: [key] });
    },
  });
}
