import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Helper laxo para consultas genéricas por nombre de tabla.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export type Property = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  country: string;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  services: string[];
  rules: string;
  check_in_time: string;
  check_out_time: string;
  base_price: number;
  extra_info: string;
  active: boolean;
  is_demo: boolean;
  created_at: string;
};

export type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  country: string;
  notes: string;
  is_demo: boolean;
  created_at: string;
};

export type Reservation = {
  id: string;
  property_id: string;
  guest_id: string | null;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  notes: string;
  status: string;
  is_demo: boolean;
  created_at: string;
};

export type Payment = {
  id: string;
  reservation_id: string;
  amount: number;
  method: string;
  paid_at: string;
  notes: string;
  is_demo: boolean;
};

export type Expense = {
  id: string;
  property_id: string | null;
  amount: number;
  category: string;
  description: string;
  spent_at: string;
};

export type Block = {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  notes: string;
};

export type Photo = {
  id: string;
  property_id: string;
  storage_path: string;
  position: number;
  is_primary: boolean;
};

export type MessageRow = {
  id: string;
  guest_id: string | null;
  reservation_id: string | null;
  property_id: string | null;
  kind: string;
  channel: string;
  content: string;
  created_at: string;
};

export type Publication = {
  id: string;
  property_id: string | null;
  platform: string;
  objective: string;
  content: string;
  created_at: string;
};

function table<T>(name: string, order: { column: string; ascending?: boolean }) {
  return async () => {
    const { data, error } = await db
      .from(name)
      .select("*")
      .order(order.column, { ascending: order.ascending ?? false });
    if (error) throw error;
    return (data ?? []) as T[];
  };
}

export const useProperties = () =>
  useQuery({
    queryKey: ["properties"],
    queryFn: table<Property>("properties", { column: "created_at", ascending: true }),
  });

export const useGuests = () =>
  useQuery({
    queryKey: ["guests"],
    queryFn: table<Guest>("guests", { column: "created_at" }),
  });

export const useReservations = () =>
  useQuery({
    queryKey: ["reservations"],
    queryFn: table<Reservation>("reservations", { column: "check_in", ascending: true }),
  });

export const usePayments = () =>
  useQuery({
    queryKey: ["payments"],
    queryFn: table<Payment>("payments", { column: "paid_at" }),
  });

export const useExpenses = () =>
  useQuery({
    queryKey: ["expenses"],
    queryFn: table<Expense>("expenses", { column: "spent_at" }),
  });

export const useBlocks = () =>
  useQuery({
    queryKey: ["blocks"],
    queryFn: table<Block>("calendar_blocks", { column: "start_date", ascending: true }),
  });

export const usePhotos = () =>
  useQuery({
    queryKey: ["photos"],
    queryFn: table<Photo>("property_photos", { column: "position", ascending: true }),
  });

export const useMessages = () =>
  useQuery({
    queryKey: ["messages"],
    queryFn: table<MessageRow>("messages", { column: "created_at" }),
  });

export const usePublications = () =>
  useQuery({
    queryKey: ["publications"],
    queryFn: table<Publication>("publications", { column: "created_at" }),
  });

export const useDismissals = () =>
  useQuery({
    queryKey: ["dismissals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunity_dismissals")
        .select("opportunity_key");
      if (error) throw error;
      return (data ?? []).map((d) => d.opportunity_key as string);
    },
  });

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export type Subscription = {
  id: string;
  plan: string;
  status: string;
  started_at: string | null;
  renews_at: string | null;
  payment_status: string | null;
};

export const useSubscription = () =>
  useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await db
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Subscription | null;
    },
  });


/** Generic write helper that keeps every module in sync. */
export function useSave(tableName: string, invalidate: string[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id?: string | undefined;
      values?: Record<string, unknown> | undefined;
      remove?: boolean | undefined;
    }) => {
      if (args.remove && args.id) {
        const { error } = await db.from(tableName).delete().eq("id", args.id);
        if (error) throw error;
        return null;
      }
      if (args.id) {
        const { data, error } = await db
          .from(tableName)
          .update(args.values!)
          .eq("id", args.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data: userRes } = await supabase.auth.getUser();
      const { data, error } = await db
        .from(tableName)
        .insert({ ...args.values, user_id: userRes.user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      for (const key of invalidate) qc.invalidateQueries({ queryKey: [key] });
    },
  });
}

export const ALL_KEYS = [
  "properties",
  "guests",
  "reservations",
  "payments",
  "expenses",
  "blocks",
  "photos",
  "messages",
  "publications",
  "dismissals",
  "profile",
];
