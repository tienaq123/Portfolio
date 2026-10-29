export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      chat_questions: {
        Row: {
          created_at: string;
          id: string;
          locale: string;
          question: string;
          rating: number | null;
          session_id: string;
          sources: string[];
          was_fallback: boolean;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id: string;
          locale: string;
          question: string;
          rating?: number | null;
          session_id: string;
          sources?: string[];
          was_fallback?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          locale?: string;
          question?: string;
          rating?: number | null;
          session_id?: string;
          sources?: string[];
          was_fallback?: boolean;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          created_at: string;
          end_date: string | null;
          highlights: NonNullable<Json>;
          id: string;
          organization: NonNullable<Json>;
          published: boolean;
          role: NonNullable<Json>;
          sort_order: number;
          start_date: string;
          type: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          end_date?: string | null;
          highlights?: NonNullable<Json>;
          id: string;
          organization: NonNullable<Json>;
          published?: boolean;
          role: NonNullable<Json>;
          sort_order?: number;
          start_date: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          highlights?: NonNullable<Json>;
          id?: string;
          organization?: NonNullable<Json>;
          published?: boolean;
          role?: NonNullable<Json>;
          sort_order?: number;
          start_date?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_entries: {
        Row: {
          created_at: string;
          facts: string[];
          id: string;
          published: boolean;
          sort_order: number;
          summary: string;
          title: NonNullable<Json>;
          updated_at: string;
          visibility: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          facts: string[];
          id: string;
          published?: boolean;
          sort_order?: number;
          summary: string;
          title: NonNullable<Json>;
          updated_at?: string;
          visibility: string;
        };
        Update: {
          created_at?: string;
          facts?: string[];
          id?: string;
          published?: boolean;
          sort_order?: number;
          summary?: string;
          title?: NonNullable<Json>;
          updated_at?: string;
          visibility?: string;
        };
        Relationships: [];
      };
      metrics: {
        Row: {
          created_at: string;
          description: Json | null;
          icon_key: string;
          id: string;
          label: NonNullable<Json>;
          published: boolean;
          sort_order: number;
          updated_at: string;
          value: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          description?: Json | null;
          icon_key: string;
          id: string;
          label: NonNullable<Json>;
          published?: boolean;
          sort_order?: number;
          updated_at?: string;
          value: string;
        };
        Update: {
          created_at?: string;
          description?: Json | null;
          icon_key?: string;
          id?: string;
          label?: NonNullable<Json>;
          published?: boolean;
          sort_order?: number;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      project_sections: {
        Row: {
          body: NonNullable<Json>;
          created_at: string;
          id: string;
          media: NonNullable<Json>;
          project_id: string;
          sort_order: number;
          title: Json | null;
          type: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          body: NonNullable<Json>;
          created_at?: string;
          id?: string;
          media?: NonNullable<Json>;
          project_id: string;
          sort_order?: number;
          title?: Json | null;
          type: string;
          updated_at?: string;
        };
        Update: {
          body?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          media?: NonNullable<Json>;
          project_id?: string;
          sort_order?: number;
          title?: Json | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_sections_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          experience_id: string | null;
          featured: boolean;
          highlights: NonNullable<Json>;
          id: string;
          impact_statement: Json | null;
          key_metrics: NonNullable<Json>;
          live_url: string | null;
          published: boolean;
          role: NonNullable<Json>;
          slug: string;
          sort_order: number;
          status: string | null;
          summary: NonNullable<Json>;
          tags: NonNullable<Json>;
          team_size: string;
          tech_stack: string[];
          thumbnail: Json | null;
          timeline: NonNullable<Json>;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          experience_id?: string | null;
          featured?: boolean;
          highlights?: NonNullable<Json>;
          id: string;
          impact_statement?: Json | null;
          key_metrics?: NonNullable<Json>;
          live_url?: string | null;
          published?: boolean;
          role: NonNullable<Json>;
          slug: string;
          sort_order?: number;
          status?: string | null;
          summary: NonNullable<Json>;
          tags?: NonNullable<Json>;
          team_size: string;
          tech_stack: string[];
          thumbnail?: Json | null;
          timeline: NonNullable<Json>;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          experience_id?: string | null;
          featured?: boolean;
          highlights?: NonNullable<Json>;
          id?: string;
          impact_statement?: Json | null;
          key_metrics?: NonNullable<Json>;
          live_url?: string | null;
          published?: boolean;
          role?: NonNullable<Json>;
          slug?: string;
          sort_order?: number;
          status?: string | null;
          summary?: NonNullable<Json>;
          tags?: NonNullable<Json>;
          team_size?: string;
          tech_stack?: string[];
          thumbnail?: Json | null;
          timeline?: NonNullable<Json>;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_experience_id_fkey";
            columns: ["experience_id"];
            isOneToOne: false;
            referencedRelation: "experiences";
            referencedColumns: ["id"];
          },
        ];
      };
      site_profile: {
        Row: {
          alternate_name: string;
          availability: Json | null;
          cv: NonNullable<Json>;
          headline: NonNullable<Json>;
          headline_accent: Json | null;
          hero: NonNullable<Json>;
          id: number;
          links: NonNullable<Json>;
          location: NonNullable<Json>;
          name: string;
          photo: Json | null;
          role: NonNullable<Json>;
          summary: NonNullable<Json>;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          alternate_name: string;
          availability?: Json | null;
          cv: NonNullable<Json>;
          headline: NonNullable<Json>;
          headline_accent?: Json | null;
          hero: NonNullable<Json>;
          id?: number;
          links: NonNullable<Json>;
          location: NonNullable<Json>;
          name: string;
          photo?: Json | null;
          role: NonNullable<Json>;
          summary: NonNullable<Json>;
          updated_at?: string;
        };
        Update: {
          alternate_name?: string;
          availability?: Json | null;
          cv?: NonNullable<Json>;
          headline?: NonNullable<Json>;
          headline_accent?: Json | null;
          hero?: NonNullable<Json>;
          id?: number;
          links?: NonNullable<Json>;
          location?: NonNullable<Json>;
          name?: string;
          photo?: Json | null;
          role?: NonNullable<Json>;
          summary?: NonNullable<Json>;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          key: string;
          label: NonNullable<Json>;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          key: string;
          label: NonNullable<Json>;
          sort_order?: number;
        };
        Update: {
          key?: string;
          label?: NonNullable<Json>;
          sort_order?: number;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category_key: string;
          name: string;
          published: boolean;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          category_key: string;
          name: string;
          published?: boolean;
          sort_order?: number;
        };
        Update: {
          category_key?: string;
          name?: string;
          published?: boolean;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "skills_category_key_fkey";
            columns: ["category_key"];
            isOneToOne: false;
            referencedRelation: "skill_categories";
            referencedColumns: ["key"];
          },
        ];
      };
      strengths: {
        Row: {
          created_at: string;
          description: NonNullable<Json>;
          icon_key: string;
          id: string;
          published: boolean;
          sort_order: number;
          title: NonNullable<Json>;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          description: NonNullable<Json>;
          icon_key: string;
          id: string;
          published?: boolean;
          sort_order?: number;
          title: NonNullable<Json>;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: NonNullable<Json>;
          icon_key?: string;
          id?: string;
          published?: boolean;
          sort_order?: number;
          title?: NonNullable<Json>;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_localized: { Args: { value: Json }; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
