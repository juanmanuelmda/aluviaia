import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askAluvia } from "@/lib/aluvia.functions";

export const Route = createFileRoute("/_authenticated/asistente")({
  head: () => ({
    meta: [
      { title: "Asistente IA — Aluvia AI" },
      { name: "description", content: "Preguntale a Aluvia AI sobre tus reservas, ingresos y ocupación con datos reales." },
      { property: "og:title", content: "Asistente IA — Aluvia AI" },
      { property: "og:description", content: "Un asistente conectado a los datos reales de tu negocio." },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "¿Cuánto facturé este mes?",
  "¿Qué propiedad tiene más noches libres?",
  "¿Qué reservas tienen saldo pendiente?",
  "¿Cómo viene mi ocupación de los próximos 15 días?",
];

type Msg = { role: "user" | "assistant"; content: string };

function AssistantPage() {
  const ask = useServerFn(askAluvia);
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const next: Msg[] = [...history, { role: "user", content: question }];
    setHistory(next);
    setInput("");
    setLoading(true);
    try {
      const r = await ask({ data: { question, history: history.slice(-10) } });
      setHistory([...next, { role: "assistant", content: r.answer }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo consultar al asistente");
      setHistory(history);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Asistente IA">
      <div className="space-y-4">
        {history.length === 0 && (
          <div className="bg-card shadow-soft rounded-2xl border p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Sparkles className="text-primary size-5" /> Hola, soy Aluvia
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Respondo solo con los datos reales de tu negocio. Probá con una de estas preguntas:
            </p>
            <div className="mt-4 grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="bg-muted hover:bg-accent rounded-xl px-3 py-2.5 text-left text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {history.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto max-w-[85%] rounded-2xl px-4 py-3 text-sm"
                  : "bg-card shadow-soft max-w-[95%] rounded-2xl border px-4 py-3 text-sm whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          ))}
          {loading && <p className="text-muted-foreground text-sm">Analizando tus datos...</p>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="bg-background sticky bottom-20 flex gap-2 lg:bottom-4"
        >
          <Textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu pregunta..."
            className="resize-none"
          />
          <Button type="submit" className="h-auto px-4" disabled={loading}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
