import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Database, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDemoAction, useDemoStatus } from "@/lib/demo";

export function DemoDataSection() {
  const navigate = useNavigate();
  const { data: status, isLoading } = useDemoStatus();
  const load = useDemoAction("load");
  const remove = useDemoAction("remove");
  const reset = useDemoAction("reset");
  const [confirm, setConfirm] = useState<"load" | "remove" | "reset" | null>(null);

  const loaded = Boolean(status?.loaded);
  const busy = load.isPending || remove.isPending || reset.isPending;

  async function run(kind: "load" | "remove" | "reset") {
    setConfirm(null);
    try {
      if (kind === "load") {
        const res = (await load.mutateAsync()) as { alreadyLoaded?: boolean };
        toast.success(res.alreadyLoaded ? "Los datos demo ya están cargados." : "Datos demo cargados");
      } else if (kind === "remove") {
        await remove.mutateAsync();
        toast.success("Datos demo eliminados");
      } else {
        await reset.mutateAsync();
        toast.success("Demo reiniciada");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo completar la operación");
    }
  }

  const copy = {
    load: {
      title: "Cargar datos demo",
      description:
        "Esto agregará propiedades, huéspedes, reservas, pagos, gastos, oportunidades y mensajes de demostración a tu cuenta. Podrás eliminarlos posteriormente.",
      action: "Cargar datos demo",
    },
    remove: {
      title: "Eliminar datos demo",
      description:
        "Se eliminarán todos los datos de demostración creados por Aluvia AI. Tus datos reales no serán afectados.",
      action: "Eliminar datos demo",
    },
    reset: {
      title: "Reiniciar demo",
      description:
        "Se eliminarán los datos demo actuales y se volverán a crear con fechas actualizadas. Tus datos reales no serán afectados.",
      action: "Reiniciar demo",
    },
  } as const;

  return (
    <SectionCard title="Datos de demostración">
      <p className="text-muted-foreground text-sm">
        Probá Aluvia AI con un negocio de alquiler temporario completo.
      </p>

      {loaded && (
        <p className="text-foreground mt-3 text-sm font-medium">
          Los datos demo ya están cargados.{" "}
          <span className="text-muted-foreground font-normal">
            {status?.total} registros marcados como demostración.
          </span>
        </p>
      )}

      <div className="mt-4 space-y-2">
        {!loaded && (
          <Button
            className="h-12 w-full"
            disabled={busy || isLoading}
            onClick={() => setConfirm("load")}
          >
            <Database className="size-4" /> Cargar datos demo
          </Button>
        )}

        {loaded && (
          <>
            <Button className="h-12 w-full" disabled={busy} onClick={() => navigate({ to: "/panel" })}>
              Ver datos demo
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full"
              disabled={busy}
              onClick={() => setConfirm("reset")}
            >
              <RotateCcw className="size-4" /> Reiniciar demo
            </Button>
            <Button
              variant="outline"
              className="text-destructive h-11 w-full"
              disabled={busy}
              onClick={() => setConfirm("remove")}
            >
              <Trash2 className="size-4" /> Eliminar datos demo
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          {confirm && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{copy[confirm].title}</AlertDialogTitle>
                <AlertDialogDescription>{copy[confirm].description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => void run(confirm)}>
                  {copy[confirm].action}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}
