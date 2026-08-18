export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      calendar_blocks: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_demo: boolean
          notes: string
          property_id: string
          reason: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_demo?: boolean
          notes?: string
          property_id: string
          reason?: string
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_demo?: boolean
          notes?: string
          property_id?: string
          reason?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_blocks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          id: string
          is_demo: boolean
          property_id: string | null
          spent_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_demo?: boolean
          property_id?: string | null
          spent_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_demo?: boolean
          property_id?: string | null
          spent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          country: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_demo: boolean
          last_name: string
          notes: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string
          created_at?: string
          email?: string
          first_name: string
          id?: string
          is_demo?: boolean
          last_name?: string
          notes?: string
          phone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_demo?: boolean
          last_name?: string
          notes?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          date: string
          id: string
          mp_payment_id: string | null
          plan: string
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          date?: string
          id?: string
          mp_payment_id?: string | null
          plan?: string
          status?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          date?: string
          id?: string
          mp_payment_id?: string | null
          plan?: string
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel: string
          content: string
          created_at: string
          guest_id: string | null
          id: string
          is_demo: boolean
          kind: string
          property_id: string | null
          reservation_id: string | null
          user_id: string
        }
        Insert: {
          channel?: string
          content: string
          created_at?: string
          guest_id?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          property_id?: string | null
          reservation_id?: string | null
          user_id: string
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          guest_id?: string | null
          id?: string
          is_demo?: boolean
          kind?: string
          property_id?: string | null
          reservation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_demo: boolean
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          kind?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunity_dismissals: {
        Row: {
          created_at: string
          id: string
          opportunity_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_key?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          is_demo: boolean
          method: string
          notes: string
          paid_at: string
          reservation_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          is_demo?: boolean
          method?: string
          notes?: string
          paid_at?: string
          reservation_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          is_demo?: boolean
          method?: string
          notes?: string
          paid_at?: string
          reservation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          currency: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          plan: string
          timezone: string
          tone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          email?: string | null
          first_name?: string
          id: string
          last_name?: string
          plan?: string
          timezone?: string
          tone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          plan?: string
          timezone?: string
          tone?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          active: boolean
          address: string
          amenities: string[]
          base_price: number
          bathrooms: number
          bedrooms: number
          beds: number
          capacity: number
          check_in_time: string
          check_out_time: string
          city: string
          country: string
          created_at: string
          description: string
          extra_info: string
          id: string
          is_demo: boolean
          name: string
          province: string
          rules: string
          services: string[]
          special_prices: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          address?: string
          amenities?: string[]
          base_price?: number
          bathrooms?: number
          bedrooms?: number
          beds?: number
          capacity?: number
          check_in_time?: string
          check_out_time?: string
          city?: string
          country?: string
          created_at?: string
          description?: string
          extra_info?: string
          id?: string
          is_demo?: boolean
          name: string
          province?: string
          rules?: string
          services?: string[]
          special_prices?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          address?: string
          amenities?: string[]
          base_price?: number
          bathrooms?: number
          bedrooms?: number
          beds?: number
          capacity?: number
          check_in_time?: string
          check_out_time?: string
          city?: string
          country?: string
          created_at?: string
          description?: string
          extra_info?: string
          id?: string
          is_demo?: boolean
          name?: string
          province?: string
          rules?: string
          services?: string[]
          special_prices?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_photos: {
        Row: {
          created_at: string
          id: string
          is_demo: boolean
          is_primary: boolean
          position: number
          property_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_demo?: boolean
          is_primary?: boolean
          position?: number
          property_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_demo?: boolean
          is_primary?: boolean
          position?: number
          property_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_demo: boolean
          objective: string
          platform: string
          property_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_demo?: boolean
          objective?: string
          platform?: string
          property_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          objective?: string
          platform?: string
          property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          guest_id: string | null
          guests_count: number
          id: string
          is_demo: boolean
          notes: string
          property_id: string
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          guest_id?: string | null
          guests_count?: number
          id?: string
          is_demo?: boolean
          notes?: string
          property_id: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          guest_id?: string | null
          guests_count?: number
          id?: string
          is_demo?: boolean
          notes?: string
          property_id?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          moneda: string
          mp_payer_id: string | null
          mp_preapproval_id: string | null
          payment_status: string
          plan: string
          precio_mensual: number
          renews_at: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          moneda?: string
          mp_payer_id?: string | null
          mp_preapproval_id?: string | null
          payment_status?: string
          plan?: string
          precio_mensual?: number
          renews_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          moneda?: string
          mp_payer_id?: string | null
          mp_preapproval_id?: string | null
          payment_status?: string
          plan?: string
          precio_mensual?: number
          renews_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
