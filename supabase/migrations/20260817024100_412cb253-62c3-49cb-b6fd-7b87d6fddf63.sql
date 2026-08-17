ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tone text NOT NULL DEFAULT 'cercano';
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS mp_preapproval_id text,
  ADD COLUMN IF NOT EXISTS mp_payer_id text,
  ADD COLUMN IF NOT EXISTS precio_mensual numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS moneda text NOT NULL DEFAULT 'ARS',
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  mp_payment_id text,
  plan text NOT NULL DEFAULT 'pro',
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'ARS',
  status text NOT NULL DEFAULT 'pending',
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own invoices" ON public.invoices;
CREATE POLICY "own invoices" ON public.invoices FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);