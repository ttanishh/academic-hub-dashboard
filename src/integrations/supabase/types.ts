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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      meeting_tasks: {
        Row: {
          action_required: string | null
          created_at: string
          date: string | null
          follow_up_date: string | null
          id: number
          key_points: string | null
          meeting_with: string | null
          purpose: string | null
          remarks: string | null
          responsible_id: number | null
          status: string
          task_type: string
          updated_at: string
        }
        Insert: {
          action_required?: string | null
          created_at?: string
          date?: string | null
          follow_up_date?: string | null
          id: number
          key_points?: string | null
          meeting_with?: string | null
          purpose?: string | null
          remarks?: string | null
          responsible_id?: number | null
          status?: string
          task_type?: string
          updated_at?: string
        }
        Update: {
          action_required?: string | null
          created_at?: string
          date?: string | null
          follow_up_date?: string | null
          id?: number
          key_points?: string | null
          meeting_with?: string | null
          purpose?: string | null
          remarks?: string | null
          responsible_id?: number | null
          status?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string
          role: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: number
          name: string
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      weekly_planner: {
        Row: {
          assigned_to_id: number | null
          assigned_to_name: string | null
          created_at: string
          date: string | null
          day: string | null
          focus_area: string | null
          id: number
          notes: string | null
          priority: string | null
          status: string
          task: string | null
          week: string | null
        }
        Insert: {
          assigned_to_id?: number | null
          assigned_to_name?: string | null
          created_at?: string
          date?: string | null
          day?: string | null
          focus_area?: string | null
          id: number
          notes?: string | null
          priority?: string | null
          status?: string
          task?: string | null
          week?: string | null
        }
        Update: {
          assigned_to_id?: number | null
          assigned_to_name?: string | null
          created_at?: string
          date?: string | null
          day?: string | null
          focus_area?: string | null
          id?: number
          notes?: string | null
          priority?: string | null
          status?: string
          task?: string | null
          week?: string | null
        }
        Relationships: []
      }
      yearly_calendar: {
        Row: {
          activity: string | null
          category: string | null
          created_at: string
          end_date: string | null
          id: number
          month: string | null
          remarks: string | null
          responsible_id: number | null
          responsible_name: string | null
          start_date: string | null
          status: string
        }
        Insert: {
          activity?: string | null
          category?: string | null
          created_at?: string
          end_date?: string | null
          id: number
          month?: string | null
          remarks?: string | null
          responsible_id?: number | null
          responsible_name?: string | null
          start_date?: string | null
          status?: string
        }
        Update: {
          activity?: string | null
          category?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          month?: string | null
          remarks?: string | null
          responsible_id?: number | null
          responsible_name?: string | null
          start_date?: string | null
          status?: string
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
