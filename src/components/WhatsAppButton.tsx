import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Abre WhatsApp con el contenido cargado. Si no hay teléfono, lo pide inline. */
export function WhatsAppButton({
  phone,
  text,
  className,
}: {
  phone?: string | null | undefined;
  text: string;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);
  const [value, setValue] = useState("");

  const open = (p: string) => {
    window.open(waLink(p, text), "_blank", "noopener");
    setAsking(false);
  };

  if (asking) {
    return (
      <div className="flex gap-2">
        <Input
          autoFocus
          className="h-11"
          inputMode="tel"
          placeholder="Ej: 5492235550000"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button className="h-11" disabled={value.replace(/\D/g, "").length < 8} onClick={() => open(value)}>
          Abrir
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className ?? "h-11"}
      onClick={() => (phone && phone.replace(/\D/g, "").length >= 8 ? open(phone) : setAsking(true))}
    >
      <MessageCircle className="size-4" /> Abrir en WhatsApp
    </Button>
  );
}
