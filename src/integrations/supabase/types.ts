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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          summary: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          summary?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          summary?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          member_id: string | null
          name: string
          role_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          name: string
          role_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          name?: string
          role_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "authors_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "studio_members"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_clusters: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          pillar_path: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          pillar_path?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          pillar_path?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_item_tags: {
        Row: {
          content_item_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_item_tags_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_item_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      content_item_topics: {
        Row: {
          content_item_id: string
          created_at: string
          topic_id: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          topic_id: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_item_topics_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_item_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          author_id: string | null
          body: string | null
          category_id: string | null
          cluster_id: string | null
          cover_media_id: string | null
          created_at: string
          created_by: string
          excerpt: string | null
          id: string
          locale: string
          published_at: string | null
          seo: Json
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          scheduled_at: string | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          version: number
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          cluster_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string
          excerpt?: string | null
          id?: string
          locale?: string
          published_at?: string | null
          seo?: Json
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          scheduled_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          version?: number
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          cluster_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string
          excerpt?: string | null
          id?: string
          locale?: string
          published_at?: string | null
          seo?: Json
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          scheduled_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "content_clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_locale_fkey"
            columns: ["locale"]
            isOneToOne: false
            referencedRelation: "locales"
            referencedColumns: ["code"]
          },
        ]
      }
      locales: {
        Row: {
          code: string
          created_at: string
          enabled: boolean
          id: string
          name: string
          native_name: string
          rtl: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          native_name: string
          rtl?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          native_name?: string
          rtl?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          author_id: string | null
          body: string | null
          category_id: string | null
          cluster_id: string | null
          content_item_id: string
          cover_media_id: string | null
          created_at: string
          created_by: string
          excerpt: string | null
          id: string
          locale: string
          published_at: string | null
          scheduled_at: string | null
          seo: Json
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          transition_from: Database["public"]["Enums"]["content_status"] | null
          transition_to: Database["public"]["Enums"]["content_status"] | null
          version: number
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          cluster_id?: string | null
          content_item_id: string
          cover_media_id?: string | null
          created_at?: string
          created_by?: string
          excerpt?: string | null
          id?: string
          locale: string
          published_at?: string | null
          scheduled_at?: string | null
          seo?: Json
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          transition_from?: Database["public"]["Enums"]["content_status"] | null
          transition_to?: Database["public"]["Enums"]["content_status"] | null
          version: number
        }
        Update: Partial<Database["public"]["Tables"]["content_versions"]["Insert"]>
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          created_by: string
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          created_by?: string
          filename: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          created_by?: string
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      studio_members: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          last_seen_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          last_seen_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          last_seen_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      studio_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_content: { Args: { _content_id: string }; Returns: boolean }
      can_transition_content_status: {
        Args: {
          _content_id: string
          _new: Database["public"]["Enums"]["content_status"]
          _old: Database["public"]["Enums"]["content_status"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_editor_or_admin: { Args: { _user_id: string }; Returns: boolean }
      restore_content_version: {
        Args: { _content_id: string; _expected_version: number; _version_id: string }
        Returns: Database["public"]["Tables"]["content_items"]["Row"]
      }
      transition_content_status: {
        Args: {
          _content_id: string
          _expected_version: number
          _scheduled_at?: string | null
          _target_status: Database["public"]["Enums"]["content_status"]
        }
        Returns: Database["public"]["Tables"]["content_items"]["Row"]
      }
    }
    Enums: {
      app_role: "writer" | "editor" | "seo_reviewer" | "publisher" | "administrator"
      content_status:
        | "draft"
        | "in_review"
        | "seo_review"
        | "approved"
        | "scheduled"
        | "published"
        | "updated"
        | "archived"
      content_type:
        | "article"
        | "blog_post"
        | "landing_page"
        | "case_study"
        | "resource"
        | "documentation"
        | "academy_lesson"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["writer", "editor", "seo_reviewer", "publisher", "administrator"],
      content_status: [
        "draft",
        "in_review",
        "seo_review",
        "approved",
        "scheduled",
        "published",
        "updated",
        "archived",
      ],
      content_type: [
        "article",
        "blog_post",
        "landing_page",
        "case_study",
        "resource",
        "documentation",
        "academy_lesson",
      ],
    },
  },
} as const
