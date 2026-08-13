import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const demoStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { countDemo } = await import("./demo.server");
    return countDemo(context.supabase, context.userId);
  });

export const loadDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { countDemo, createDemo } = await import("./demo.server");
    const status = await countDemo(context.supabase, context.userId);
    if (status.loaded) return { created: false, alreadyLoaded: true };
    await createDemo(context.supabase, context.userId);
    return { created: true, alreadyLoaded: false };
  });

export const removeDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { removeDemo } = await import("./demo.server");
    await removeDemo(context.supabase, context.userId);
    return { removed: true };
  });

export const resetDemoData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { createDemo, removeDemo } = await import("./demo.server");
    await removeDemo(context.supabase, context.userId);
    await createDemo(context.supabase, context.userId);
    return { reset: true };
  });
