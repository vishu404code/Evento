export type UserRole = 'STUDENT' | 'ORGANIZER';

export type AuthProvider = 'google' | 'email';

export interface UserProfile {
  id: string;
  auth_provider: AuthProvider;
  provider_id: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  university?: string;
  department?: string;
  academic_year?: string;
  role?: UserRole;
  onboarding_completed: boolean;
  password_hash?: string; // used for email authentication
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  token: string;
  user_id: string;
  email: string;
  role?: UserRole;
  onboarding_completed: boolean;
  expires_at: number; // Unix timestamp in ms
}

export interface OnboardingData {
  full_name: string;
  email: string;
  profile_picture?: string;
  university: string;
  department: string;
  academic_year: string;
  role: UserRole;
}

