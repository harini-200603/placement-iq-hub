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
      ai_chat_history: {
        Row: {
          content: string
          context: string | null
          created_at: string
          id: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          content: string
          context?: string | null
          created_at?: string
          id?: string
          role: string
          thread_id?: string
          user_id: string
        }
        Update: {
          content?: string
          context?: string | null
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          marked_by: string | null
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          code: string
          created_at: string
          criteria: Json | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          module: string
          score: number
          title: string
          total_questions: number
          user_id: string
          user_name: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          module: string
          score: number
          title: string
          total_questions: number
          user_id: string
          user_name: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          module?: string
          score?: number
          title?: string
          total_questions?: number
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      company_readiness: {
        Row: {
          company: string
          gaps: Json | null
          id: string
          last_evaluated_at: string
          readiness_score: number
          strengths: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          gaps?: Json | null
          id?: string
          last_evaluated_at?: string
          readiness_score?: number
          strengths?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          gaps?: Json | null
          id?: string
          last_evaluated_at?: string
          readiness_score?: number
          strengths?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      faculty_announcements: {
        Row: {
          body: string | null
          category: string
          created_at: string
          faculty_id: string
          id: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          faculty_id: string
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          faculty_id?: string
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mistake_notebook: {
        Row: {
          correct_answer: string | null
          created_at: string
          difficulty: string | null
          explanation: string | null
          id: string
          question: string
          reviewed: boolean
          subject: string
          topic: string | null
          updated_at: string
          user_answer: string | null
          user_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          question: string
          reviewed?: boolean
          subject: string
          topic?: string | null
          updated_at?: string
          user_answer?: string | null
          user_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          question?: string
          reviewed?: boolean
          subject?: string
          topic?: string | null
          updated_at?: string
          user_answer?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mock_tests: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          module: string
          title: string
          total_questions: number
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          module: string
          title: string
          total_questions?: number
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          module?: string
          title?: string
          total_questions?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      placement_drives: {
        Row: {
          company: string
          created_at: string
          description: string | null
          drive_date: string | null
          eligibility_cgpa: number | null
          faculty_id: string
          id: string
          min_readiness: number | null
          package_lpa: number | null
          role_title: string | null
          shortlisted_ids: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          drive_date?: string | null
          eligibility_cgpa?: number | null
          faculty_id: string
          id?: string
          min_readiness?: number | null
          package_lpa?: number | null
          role_title?: string | null
          shortlisted_ids?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          drive_date?: string | null
          eligibility_cgpa?: number | null
          faculty_id?: string
          id?: string
          min_readiness?: number | null
          package_lpa?: number | null
          role_title?: string | null
          shortlisted_ids?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          college: string | null
          created_at: string
          department: string | null
          full_name: string
          id: string
          phone: string | null
          register_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          college?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          id?: string
          phone?: string | null
          register_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          college?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          register_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      question_assignments: {
        Row: {
          assign_to: string
          assigned_student_ids: string[] | null
          company_focus: string | null
          created_at: string
          description: string | null
          due_date: string | null
          faculty_id: string
          id: string
          subject_id: string
          title: string
          topic_id: string | null
        }
        Insert: {
          assign_to?: string
          assigned_student_ids?: string[] | null
          company_focus?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          faculty_id: string
          id?: string
          subject_id: string
          title: string
          topic_id?: string | null
        }
        Update: {
          assign_to?: string
          assigned_student_ids?: string[] | null
          company_focus?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          faculty_id?: string
          id?: string
          subject_id?: string
          title?: string
          topic_id?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_option: string
          created_at: string
          difficulty: string
          explanation: string | null
          id: string
          module: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
        }
        Insert: {
          correct_option: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          module: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
        }
        Update: {
          correct_option?: string
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          module?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          current_streak: number
          last_active_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          quiz_score: number | null
          quiz_total: number | null
          status: string
          subject_id: string
          time_spent_seconds: number | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quiz_score?: number | null
          quiz_total?: number | null
          status?: string
          subject_id: string
          time_spent_seconds?: number | null
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          quiz_score?: number | null
          quiz_total?: number | null
          status?: string
          subject_id?: string
          time_spent_seconds?: number | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          ended_at: string | null
          id: string
          started_at: string
          subject: string
          topic: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          subject: string
          topic?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          started_at?: string
          subject?: string
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string
          id: string
          mock_test_id: string | null
          module: string
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          mock_test_id?: string | null
          module: string
          score?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          mock_test_id?: string | null
          module?: string
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_faculty: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      user_role: "student" | "faculty"
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
      user_role: ["student", "faculty"],
    },
  },
} as const
