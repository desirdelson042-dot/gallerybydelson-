export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_blocks: {
        Row: {
          body: string
          heading: string
          id: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          body?: string
          heading?: string
          id?: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          body?: string
          heading?: string
          id?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      about_content: {
        Row: {
          biography: string
          cta_text: string
          cta_url: string
          id: number
          name: string
          personal_statement: string
          profile_image_url: string | null
          short_intro: string
          title: string
          updated_at: string
        }
        Insert: {
          biography?: string
          cta_text?: string
          cta_url?: string
          id?: number
          name?: string
          personal_statement?: string
          profile_image_url?: string | null
          short_intro?: string
          title?: string
          updated_at?: string
        }
        Update: {
          biography?: string
          cta_text?: string
          cta_url?: string
          id?: number
          name?: string
          personal_statement?: string
          profile_image_url?: string | null
          short_intro?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      about_skills: {
        Row: {
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      about_stats: {
        Row: {
          id: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          categories: string[]
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          featured: boolean
          gallery: Json
          id: string
          published_at: string | null
          seo_description: string
          seo_title: string
          slug: string
          sort_order: number
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          categories?: string[]
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          featured?: boolean
          gallery?: Json
          id?: string
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug: string
          sort_order?: number
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          categories?: string[]
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          featured?: boolean
          gallery?: Json
          id?: string
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug?: string
          sort_order?: number
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          is_current: boolean
          logo_url: string | null
          position: string
          sort_order: number
          start_date: string | null
          url: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          logo_url?: string | null
          position?: string
          sort_order?: number
          start_date?: string | null
          url?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          logo_url?: string | null
          position?: string
          sort_order?: number
          start_date?: string | null
          url?: string | null
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          background_type: string
          bg_color: string
          bg_color_secondary: string
          bg_image_object_position: string
          bg_image_scale: number
          bg_image_url: string | null
          bg_size: string
          bg_video_url: string | null
          blur: number
          brightness: number
          content_width: string
          cta_enabled: boolean
          cta_text: string
          cta_url: string
          description: string
          desktop_layout: string
          gradient_direction: string
          hero_height: string
          id: number
          image_position: string
          mobile_bg_image_url: string | null
          mobile_bg_video_url: string | null
          mobile_layout: string
          overlay_color: string
          overlay_enabled: boolean
          overlay_opacity: number
          padding: string
          section_spacing: string
          subtitle: string
          tablet_layout: string
          text_alignment: string
          text_position: string
          title: string
          title_visible: boolean
          subtitle_visible: boolean
          description_visible: boolean
          updated_at: string
        }
        Insert: {
          background_type?: string
          bg_color?: string
          bg_color_secondary?: string
          bg_image_object_position?: string
          bg_image_scale?: number
          bg_image_url?: string | null
          bg_size?: string
          bg_video_url?: string | null
          blur?: number
          brightness?: number
          content_width?: string
          cta_enabled?: boolean
          cta_text?: string
          cta_url?: string
          description?: string
          desktop_layout?: string
          gradient_direction?: string
          hero_height?: string
          id?: number
          image_position?: string
          mobile_bg_image_url?: string | null
          mobile_bg_video_url?: string | null
          mobile_layout?: string
          overlay_color?: string
          overlay_enabled?: boolean
          overlay_opacity?: number
          padding?: string
          section_spacing?: string
          subtitle?: string
          tablet_layout?: string
          text_alignment?: string
          text_position?: string
          title?: string
          title_visible?: boolean
          subtitle_visible?: boolean
          description_visible?: boolean
          updated_at?: string
        }
        Update: {
          background_type?: string
          bg_color?: string
          bg_color_secondary?: string
          bg_image_object_position?: string
          bg_image_scale?: number
          bg_image_url?: string | null
          bg_size?: string
          bg_video_url?: string | null
          blur?: number
          brightness?: number
          content_width?: string
          cta_enabled?: boolean
          cta_text?: string
          cta_url?: string
          description?: string
          desktop_layout?: string
          gradient_direction?: string
          hero_height?: string
          id?: number
          image_position?: string
          mobile_bg_image_url?: string | null
          mobile_bg_video_url?: string | null
          mobile_layout?: string
          overlay_color?: string
          overlay_enabled?: boolean
          overlay_opacity?: number
          padding?: string
          section_spacing?: string
          subtitle?: string
          tablet_layout?: string
          text_alignment?: string
          text_position?: string
          title?: string
          title_visible?: boolean
          subtitle_visible?: boolean
          description_visible?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string
          caption: string
          created_at: string
          id: string
          is_primary: boolean
          object_fit: string
          object_position: string
          scale: number
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string
          caption?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          object_fit?: string
          object_position?: string
          scale?: number
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string
          caption?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          object_fit?: string
          object_position?: string
          scale?: number
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      hero_text_blocks: {
        Row: {
          block_type: string
          content: string
          created_at: string
          id: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          block_type?: string
          content?: string
          created_at?: string
          id?: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          block_type?: string
          content?: string
          created_at?: string
          id?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          created_at: string
          description: string
          id: string
          is_replay: boolean
          published: boolean
          replay_url: string | null
          scheduled_at: string | null
          sort_order: number
          status: string
          stream_provider: string
          stream_url: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_replay?: boolean
          published?: boolean
          replay_url?: string | null
          scheduled_at?: string | null
          sort_order?: number
          status?: string
          stream_provider?: string
          stream_url?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_replay?: boolean
          published?: boolean
          replay_url?: string | null
          scheduled_at?: string | null
          sort_order?: number
          status?: string
          stream_provider?: string
          stream_url?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string
          caption: string
          created_at: string
          filename: string
          height: number | null
          id: string
          media_type: string
          size_bytes: number | null
          storage_path: string
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string
          caption?: string
          created_at?: string
          filename?: string
          height?: number | null
          id?: string
          media_type?: string
          size_bytes?: number | null
          storage_path: string
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string
          caption?: string
          created_at?: string
          filename?: string
          height?: number | null
          id?: string
          media_type?: string
          size_bytes?: number | null
          storage_path?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      project_media: {
        Row: {
          alt_text: string
          caption: string
          created_at: string
          id: string
          media_type: string
          project_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string
          caption?: string
          created_at?: string
          id?: string
          media_type?: string
          project_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string
          caption?: string
          created_at?: string
          id?: string
          media_type?: string
          project_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          client: string
          cover_image_url: string | null
          created_at: string
          description: string
          external_url: string | null
          featured: boolean
          id: string
          role: string
          seo_description: string
          seo_title: string
          services: string[]
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          video_url: string | null
          year: string
        }
        Insert: {
          category?: string
          client?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string
          external_url?: string | null
          featured?: boolean
          id?: string
          role?: string
          seo_description?: string
          seo_title?: string
          services?: string[]
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          video_url?: string | null
          year?: string
        }
        Update: {
          category?: string
          client?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string
          external_url?: string | null
          featured?: boolean
          id?: string
          role?: string
          seo_description?: string
          seo_title?: string
          services?: string[]
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          video_url?: string | null
          year?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string
          custom_body: string | null
          id: string
          is_deletable: boolean
          key: string
          section_type: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          custom_body?: string | null
          id?: string
          is_deletable?: boolean
          key: string
          section_type: string
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          custom_body?: string | null
          id?: string
          is_deletable?: boolean
          key?: string
          section_type?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_text: string
          cta_url: string
          description: string
          icon: string
          id: string
          image_url: string | null
          sort_order: number
          title: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          cta_text?: string
          cta_url?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          cta_text?: string
          cta_url?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          favicon_url: string | null
          footer_content: Json
          id: number
          meta_image_url: string | null
          preview_token: string
          site_description: string
          site_title: string
          updated_at: string
        }
        Insert: {
          favicon_url?: string | null
          footer_content?: Json
          id?: number
          meta_image_url?: string | null
          preview_token?: string
          site_description?: string
          site_title?: string
          updated_at?: string
        }
        Update: {
          favicon_url?: string | null
          footer_content?: Json
          id?: number
          meta_image_url?: string | null
          preview_token?: string
          site_description?: string
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          active: boolean
          created_at: string
          icon: string
          id: string
          label: string
          platform: string
          sort_order: number
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string
          id?: string
          label?: string
          platform: string
          sort_order?: number
          url?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string
          id?: string
          label?: string
          platform?: string
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_admin: { Args: never; Returns: boolean }
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

type DefaultSchema = Database["public"]

export type Tables<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Update"]
