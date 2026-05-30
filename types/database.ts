export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'admin' | 'support'
export type CourseStatus = 'draft' | 'published'
export type EnrollmentStatus = 'active' | 'revoked' | 'expired'
export type GrantedBy = 'webhook' | 'manual'
export type PurchaseStatus = 'approved' | 'refunded' | 'cancelled'
export type ProductType = 'single' | 'combo'
export type MaterialType = 'pdf' | 'link' | 'zip'

export interface Profile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_url: string | null
  trailer_panda_id: string | null
  status: CourseStatus
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  panda_video_id: string
  duration_seconds: number
  order_index: number
  is_preview: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  hubla_product_id: string
  name: string
  type: ProductType
  active: boolean
  created_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  status: EnrollmentStatus
  granted_by: GrantedBy
  granted_at: string
  revoked_at: string | null
  updated_at: string
}

export interface Purchase {
  id: string
  student_id: string
  product_id: string | null
  hubla_order_id: string
  amount_cents: number
  status: PurchaseStatus
  purchased_at: string
  updated_at: string
}

export interface WebhookEvent {
  id: string
  hubla_event_id: string
  event_type: string
  payload: Json
  processed: boolean
  error: string | null
  received_at: string
}

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  completed: boolean
  watched_seconds: number
  last_watched_at: string
}

export interface Material {
  id: string
  course_id: string
  module_id: string | null
  lesson_id: string | null
  title: string
  file_url: string
  type: MaterialType
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> }
      courses: { Row: Course; Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Course> }
      modules: { Row: Module; Insert: Omit<Module, 'id' | 'created_at'>; Update: Partial<Module> }
      lessons: { Row: Lesson; Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Lesson> }
      products: { Row: Product; Insert: Omit<Product, 'id' | 'created_at'>; Update: Partial<Product> }
      enrollments: { Row: Enrollment; Insert: Omit<Enrollment, 'id' | 'granted_at' | 'updated_at'>; Update: Partial<Enrollment> }
      purchases: { Row: Purchase; Insert: Omit<Purchase, 'id' | 'purchased_at' | 'updated_at'>; Update: Partial<Purchase> }
      webhook_events: { Row: WebhookEvent; Insert: Omit<WebhookEvent, 'id' | 'received_at'>; Update: Partial<WebhookEvent> }
      lesson_progress: { Row: LessonProgress; Insert: Omit<LessonProgress, 'id'>; Update: Partial<LessonProgress> }
      materials: { Row: Material; Insert: Omit<Material, 'id' | 'created_at'>; Update: Partial<Material> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
