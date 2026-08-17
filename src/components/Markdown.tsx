import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Renderiza **negrita**, *cursiva*, `código`, listas y saltos de línea sin mostrar asteriscos crudos. */
function inline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\n]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyBase}-${i++}`;
    if (token.startsWith("**") || token.startsWith("__")) {
      parts.push(
        <strong key={key} className="font-bold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={key} className="bg-muted rounded px-1 py-0.5 text-[0.9em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      parts.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={key} className="my-1 list-disc space-y-1 pl-5">
        {list.map((item, i) => (
          <li key={i}>{inline(item, `${key}-${i}`)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const bullet = /^\s*([*-]|\d+\.)\s+(.*)$/.exec(line);
    if (bullet) {
      list.push(bullet[2] ?? "");
      return;
    }
    flush(`list-${index}`);
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push(
        <p key={index} className="mt-2 font-bold">
          {inline(heading[2] ?? "", `h-${index}`)}
        </p>,
      );
      return;
    }
    if (line.trim() === "") {
      blocks.push(<div key={index} className="h-2" />);
      return;
    }
    blocks.push(<p key={index}>{inline(line, `p-${index}`)}</p>);
  });
  flush("list-end");

  return <div className={cn("space-y-1 leading-relaxed", className)}>{blocks}</div>;
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-primary/60 size-2 animate-bounce rounded-full"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function TextSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="bg-muted h-3.5 animate-pulse rounded"
          style={{ width: `${70 + ((i * 13) % 30)}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
