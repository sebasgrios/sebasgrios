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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          meta_line: Json
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          meta_line: Json
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          meta_line?: Json
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      education: {
        Row: {
          bullets: Json
          created_at: string
          description: Json
          end_date: string | null
          id: string
          school: string
          sort_order: number
          start_date: string
          title: Json
          updated_at: string
        }
        Insert: {
          bullets?: Json
          created_at?: string
          description: Json
          end_date?: string | null
          id?: string
          school: string
          sort_order?: number
          start_date: string
          title: Json
          updated_at?: string
        }
        Update: {
          bullets?: Json
          created_at?: string
          description?: Json
          end_date?: string | null
          id?: string
          school?: string
          sort_order?: number
          start_date?: string
          title?: Json
          updated_at?: string
        }
        Relationships: []
      }
      education_technologies: {
        Row: {
          education_id: string
          sort_order: number
          technology_id: string
        }
        Insert: {
          education_id: string
          sort_order?: number
          technology_id: string
        }
        Update: {
          education_id?: string
          sort_order?: number
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_technologies_education_id_fkey"
            columns: ["education_id"]
            isOneToOne: false
            referencedRelation: "education"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar_url: string | null
          contact_lead: Json
          contact_title: Json
          created_at: string
          email: string
          experience_start_date: string
          full_name: string
          github_url: string | null
          hero_badges: Json
          id: string
          is_open_to_work: boolean
          is_singleton: boolean | null
          lead: Json
          linkedin_url: string | null
          meta_description: Json
          meta_title: Json
          photo_url: string | null
          role: Json
          short_name: string
          status_label: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          contact_lead: Json
          contact_title: Json
          created_at?: string
          email: string
          experience_start_date: string
          full_name: string
          github_url?: string | null
          hero_badges?: Json
          id?: string
          is_open_to_work?: boolean
          is_singleton?: boolean | null
          lead: Json
          linkedin_url?: string | null
          meta_description: Json
          meta_title: Json
          photo_url?: string | null
          role: Json
          short_name: string
          status_label: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          contact_lead?: Json
          contact_title?: Json
          created_at?: string
          email?: string
          experience_start_date?: string
          full_name?: string
          github_url?: string | null
          hero_badges?: Json
          id?: string
          is_open_to_work?: boolean
          is_singleton?: boolean | null
          lead?: Json
          linkedin_url?: string | null
          meta_description?: Json
          meta_title?: Json
          photo_url?: string | null
          role?: Json
          short_name?: string
          status_label?: Json
          updated_at?: string
        }
        Relationships: []
      }
      project_technologies: {
        Row: {
          project_id: string
          sort_order: number
          technology_id: string
        }
        Insert: {
          project_id: string
          sort_order?: number
          technology_id: string
        }
        Update: {
          project_id?: string
          sort_order?: number
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          code_url: string | null
          created_at: string
          description: Json
          id: string
          image_url: string | null
          live_url: string | null
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code_url?: string | null
          created_at?: string
          description: Json
          id?: string
          image_url?: string | null
          live_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code_url?: string | null
          created_at?: string
          description?: Json
          id?: string
          image_url?: string | null
          live_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      role_technologies: {
        Row: {
          role_id: string
          sort_order: number
          technology_id: string
        }
        Insert: {
          role_id: string
          sort_order?: number
          technology_id: string
        }
        Update: {
          role_id?: string
          sort_order?: number
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_technologies_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          bullets: Json
          company_id: string
          created_at: string
          description: Json
          end_date: string | null
          id: string
          mode: Json
          mode_key: string
          sector: Json
          sort_order: number
          start_date: string
          title: Json
          updated_at: string
        }
        Insert: {
          bullets?: Json
          company_id: string
          created_at?: string
          description: Json
          end_date?: string | null
          id?: string
          mode: Json
          mode_key: string
          sector: Json
          sort_order?: number
          start_date: string
          title: Json
          updated_at?: string
        }
        Update: {
          bullets?: Json
          company_id?: string
          created_at?: string
          description?: Json
          end_date?: string | null
          id?: string
          mode?: Json
          mode_key?: string
          sector?: Json
          sort_order?: number
          start_date?: string
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      stack_group_technologies: {
        Row: {
          sort_order: number
          stack_group_id: string
          technology_id: string
        }
        Insert: {
          sort_order?: number
          stack_group_id: string
          technology_id: string
        }
        Update: {
          sort_order?: number
          stack_group_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stack_group_technologies_stack_group_id_fkey"
            columns: ["stack_group_id"]
            isOneToOne: false
            referencedRelation: "stack_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stack_group_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      stack_groups: {
        Row: {
          created_at: string
          icon_key: string
          id: string
          label: Json
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon_key: string
          id?: string
          label: Json
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon_key?: string
          id?: string
          label?: Json
          sort_order?: number
        }
        Relationships: []
      }
      technologies: {
        Row: {
          created_at: string
          icon_key: string | null
          id: string
          key: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon_key?: string | null
          id?: string
          key: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon_key?: string | null
          id?: string
          key?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
