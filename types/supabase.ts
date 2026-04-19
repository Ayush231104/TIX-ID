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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booking_seats: {
        Row: {
          booking_id: string | null
          booking_seat_status:
            | Database["public"]["Enums"]["booking_seat_status_enum"]
            | null
          created_at: string | null
          id: string
          seat_id: string | null
          showtime_id: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          booking_seat_status?:
            | Database["public"]["Enums"]["booking_seat_status_enum"]
            | null
          created_at?: string | null
          id?: string
          seat_id?: string | null
          showtime_id?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          booking_seat_status?:
            | Database["public"]["Enums"]["booking_seat_status_enum"]
            | null
          created_at?: string | null
          id?: string
          seat_id?: string | null
          showtime_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_seats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_seats_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_seats_showtime_id_fkey"
            columns: ["showtime_id"]
            isOneToOne: false
            referencedRelation: "showtimes"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_status:
            | Database["public"]["Enums"]["booking_status_enum"]
            | null
          created_at: string | null
          discount_id: string | null
          id: string
          showtime_id: string | null
          total_amount: number | null
          total_seats: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_status?:
            | Database["public"]["Enums"]["booking_status_enum"]
            | null
          created_at?: string | null
          discount_id?: string | null
          id?: string
          showtime_id?: string | null
          total_amount?: number | null
          total_seats?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_status?:
            | Database["public"]["Enums"]["booking_status_enum"]
            | null
          created_at?: string | null
          discount_id?: string | null
          id?: string
          showtime_id?: string | null
          total_amount?: number | null
          total_seats?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_showtime_id_fkey"
            columns: ["showtime_id"]
            isOneToOne: false
            referencedRelation: "showtimes"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          state: string | null
        }
        Insert: {
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          state?: string | null
        }
        Update: {
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string | null
        }
        Relationships: []
      }
      discount: {
        Row: {
          code: string
          created_at: string | null
          discount_type:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          discounted_amount: number | null
          id: string
          is_active: boolean | null
          min_amount: number | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type?:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          discounted_amount?: number | null
          id?: string
          is_active?: boolean | null
          min_amount?: number | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?:
            | Database["public"]["Enums"]["discount_type_enum"]
            | null
          discounted_amount?: number | null
          id?: string
          is_active?: boolean | null
          min_amount?: number | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_until?: string | null
        }
        Relationships: []
      }
      movies: {
        Row: {
          age_rating: Database["public"]["Enums"]["age_rating_enum"] | null
          audience_score: number | null
          created_at: string | null
          director: string | null
          duration: string | null
          genre: Database["public"]["Enums"]["genre_enum"] | null
          id: string
          movie_img: string | null
          movies_status: Database["public"]["Enums"]["movie_status_enum"] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          age_rating?: Database["public"]["Enums"]["age_rating_enum"] | null
          audience_score?: number | null
          created_at?: string | null
          director?: string | null
          duration?: string | null
          genre?: Database["public"]["Enums"]["genre_enum"] | null
          id?: string
          movie_img?: string | null
          movies_status?:
            | Database["public"]["Enums"]["movie_status_enum"]
            | null
          name: string
          updated_at?: string | null
        }
        Update: {
          age_rating?: Database["public"]["Enums"]["age_rating_enum"] | null
          audience_score?: number | null
          created_at?: string | null
          director?: string | null
          duration?: string | null
          genre?: Database["public"]["Enums"]["genre_enum"] | null
          id?: string
          movie_img?: string | null
          movies_status?:
            | Database["public"]["Enums"]["movie_status_enum"]
            | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          img: string | null
          likes: number | null
          release_date: string | null
          subtitle: string | null
          tag: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          img?: string | null
          likes?: number | null
          release_date?: string | null
          subtitle?: string | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          img?: string | null
          likes?: number | null
          release_date?: string | null
          subtitle?: string | null
          tag?: string | null
          title?: string | null
        }
        Relationships: []
      }
      news_likes: {
        Row: {
          created_at: string | null
          news_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          news_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          news_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_likes_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          booking_id: string | null
          created_at: string | null
          currency: string | null
          gateway_response: Json | null
          id: string
          payment_method:
            | Database["public"]["Enums"]["payment_method_enum"]
            | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          refund_id: string | null
          refund_status:
            | Database["public"]["Enums"]["refund_status_enum"]
            | null
          refunded_at: string | null
          stripe_charge_id: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          payment_method?:
            | Database["public"]["Enums"]["payment_method_enum"]
            | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          refund_id?: string | null
          refund_status?:
            | Database["public"]["Enums"]["refund_status_enum"]
            | null
          refunded_at?: string | null
          stripe_charge_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          payment_method?:
            | Database["public"]["Enums"]["payment_method_enum"]
            | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          refund_id?: string | null
          refund_status?:
            | Database["public"]["Enums"]["refund_status_enum"]
            | null
          refunded_at?: string | null
          stripe_charge_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          address: string | null
          age: number | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          mobile_no: string | null
          role: Database["public"]["Enums"]["role_enum"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          mobile_no?: string | null
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          mobile_no?: string | null
          role?: Database["public"]["Enums"]["role_enum"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      screen: {
        Row: {
          created_at: string | null
          id: string
          name: string
          seat_col: number | null
          seat_row: number | null
          theater_id: string | null
          total_seats: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          seat_col?: number | null
          seat_row?: number | null
          theater_id?: string | null
          total_seats?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          seat_col?: number | null
          seat_row?: number | null
          theater_id?: string | null
          total_seats?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screen_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theater"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_locked: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          locked_at: string | null
          reservation_status:
            | Database["public"]["Enums"]["reservation_status_enum"]
            | null
          seat_id: string | null
          showtime_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          locked_at?: string | null
          reservation_status?:
            | Database["public"]["Enums"]["reservation_status_enum"]
            | null
          seat_id?: string | null
          showtime_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          locked_at?: string | null
          reservation_status?:
            | Database["public"]["Enums"]["reservation_status_enum"]
            | null
          seat_id?: string | null
          showtime_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_locked_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_locked_showtime_id_fkey"
            columns: ["showtime_id"]
            isOneToOne: false
            referencedRelation: "showtimes"
            referencedColumns: ["id"]
          },
        ]
      }
      seats: {
        Row: {
          created_at: string | null
          id: string
          screen_id: string | null
          seat_col: number
          seat_row: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          screen_id?: string | null
          seat_col: number
          seat_row: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          screen_id?: string | null
          seat_col?: number
          seat_row?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seats_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screen"
            referencedColumns: ["id"]
          },
        ]
      }
      showtimes: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          movie_id: string | null
          price: number | null
          screen_id: string | null
          show_time: string
          theater_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          movie_id?: string | null
          price?: number | null
          screen_id?: string | null
          show_time: string
          theater_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          movie_id?: string | null
          price?: number | null
          screen_id?: string | null
          show_time?: string
          theater_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "showtimes_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showtimes_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screen"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showtimes_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theater"
            referencedColumns: ["id"]
          },
        ]
      }
      theater: {
        Row: {
          address: string | null
          brand_id: string | null
          city_id: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          brand_id?: string | null
          city_id?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          brand_id?: string | null
          city_id?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theater_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_status: {
        Row: {
          email: string | null
          is_verified: boolean | null
        }
        Insert: {
          email?: string | null
          is_verified?: never
        }
        Update: {
          email?: string | null
          is_verified?: never
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_user_role: { Args: never; Returns: string }
      increment_discount_usage: { Args: { d_id: string }; Returns: undefined }
      release_expired_locks: { Args: never; Returns: undefined }
      sync_booking_seats: {
        Args: {
          p_seats_to_add: string[]
          p_seats_to_del: string[]
          p_showtime_id: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      age_rating_enum: "U" | "UA" | "UA7+" | "UA13+" | "UA16+" | "A" | "S"
      booking_seat_status_enum: "reserved" | "confirmed" | "cancelled"
      booking_status_enum: "pending" | "paid" | "cancelled"
      discount_type_enum: "percent" | "flat"
      genre_enum:
        | "action"
        | "war"
        | "horror"
        | "crime"
        | "thriller"
        | "western"
        | "romance"
      movie_status_enum: "upcoming" | "streaming"
      payment_method_enum: "card" | "upi" | "wallet"
      payment_status_enum: "pending" | "succeeded" | "failed" | "refunded"
      refund_status_enum: "null" | "pending" | "succeeded" | "failed"
      reservation_status_enum: "available" | "hold" | "released"
      role_enum: "user" | "super_admin" | "theater_admin"
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
    Enums: {
      age_rating_enum: ["U", "UA", "UA7+", "UA13+", "UA16+", "A", "S"],
      booking_seat_status_enum: ["reserved", "confirmed", "cancelled"],
      booking_status_enum: ["pending", "paid", "cancelled"],
      discount_type_enum: ["percent", "flat"],
      genre_enum: [
        "action",
        "war",
        "horror",
        "crime",
        "thriller",
        "western",
        "romance",
      ],
      movie_status_enum: ["upcoming", "streaming"],
      payment_method_enum: ["card", "upi", "wallet"],
      payment_status_enum: ["pending", "succeeded", "failed", "refunded"],
      refund_status_enum: ["null", "pending", "succeeded", "failed"],
      reservation_status_enum: ["available", "hold", "released"],
      role_enum: ["user", "super_admin", "theater_admin"],
    },
  },
} as const

