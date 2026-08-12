import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_CLASS, STATUS_LABEL } from "@/lib/format";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "accent" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    default: "text-foreground",
    accent: "text-accent-foreground",
    success: "text-success",
    warning: "text-destructive",
  };
  return (
    <div className="bg-card shadow-soft rounded-2xl border p-4">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className={cn("mt-1 text-xl font-bold sm:text-2xl", tones[tone])}>{value}</p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-card shadow-soft rounded-2xl border", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
          {title && <h2 className="text-sm font-bold">{title}</h2>}
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="text-muted-foreground py-6 text-center text-sm">{text}</p>;
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
        STATUS_CLASS[status] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
