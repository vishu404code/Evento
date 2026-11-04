import { dbService } from './db';
import { UserProfile, UserSession, OnboardingData } from '../types/auth';

const SESSION_KEY = 'evento_session_v1';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple hash simulation for client-side password verification
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(16) + '_' + password.length;
}

class AuthService {
  private listeners: Array<(user: UserProfile | null) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === SESSION_KEY) {
          this.notifyListeners();
        }
      });
    }
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    // Call immediately with current state
    this.getCurrentUser().then(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private async notifyListeners() {
    const user = await this.getCurrentUser();
    this.listeners.forEach((cb) => cb(user));
  }

  // Session Management
  private getStoredSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as UserSession;
      if (Date.now() > session.expires_at) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private setSession(user: UserProfile): UserSession {
    const session: UserSession = {
      token: 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      user_id: user.id,
      email: user.email,
      role: user.role,
      onboarding_completed: user.onboarding_completed,
      expires_at: Date.now() + SESSION_DURATION_MS,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  // Get currently logged-in user
  async getCurrentUser(): Promise<UserProfile | null> {
    const session = this.getStoredSession();
    if (!session) return null;
    const user = await dbService.getUserById(session.user_id);
    if (!user) {
      this.clearSession();
      return null;
    }
    return user;
  }

  // Check if session is valid
  isAuthenticated(): boolean {
    return this.getStoredSession() !== null;
  }

  // Email Authentication: Sign Up
  async registerWithEmail(
    email: string,
    password: string,
    fullName: string
  ): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Please enter your full name.');
    }

    const existingUser = await dbService.getUserByEmail(cleanEmail);
    if (existingUser) {
      // If user signed in with Google before, link the account by adding password hash
      if (existingUser.auth_provider === 'google' && !existingUser.password_hash) {
        const updated = await dbService.updateUser(existingUser.id, {
          password_hash: hashPassword(password),
        });
        this.setSession(updated);
        await this.notifyListeners();
        return updated;
      }
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const now = new Date().toISOString();
    const newUser: UserProfile = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      auth_provider: 'email',
      provider_id: cleanEmail,
      full_name: fullName.trim(),
      email: cleanEmail,
      password_hash: hashPassword(password),
      onboarding_completed: false,
      created_at: now,
      updated_at: now,
    };

    const saved = await dbService.saveUser(newUser);
    this.setSession(saved);
    await this.notifyListeners();
    return saved;
  }

  // Email Authentication: Sign In
  async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    const user = await dbService.getUserByEmail(cleanEmail);
    if (!user) {
      throw new Error('No account found with this email. Please check your credentials or create an account.');
    }

    if (user.password_hash) {
      const match = user.password_hash === hashPassword(password);
      if (!match) {
        throw new Error('Incorrect password. Please try again.');
      }
    } else if (user.auth_provider === 'google') {
      // User registered via Google OAuth
      throw new Error('This account was created with Google. Please use "Continue with Google" to sign in.');
    } else {
      throw new Error('Invalid account configuration. Please reset your password.');
    }

    this.setSession(user);
    await this.notifyListeners();
    return user;
  }

  // Google OAuth Authentication
  async loginWithGoogle(googleProfile: {
    email: string;
    name: string;
    picture?: string;
    sub?: string;
  }): Promise<UserProfile> {
    const cleanEmail = googleProfile.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Invalid Google account information.');
    }

    const existingUser = await dbService.getUserByEmail(cleanEmail);
    if (existingUser) {
      // Secure account linking: update profile picture and provider if needed
      const updates: Partial<UserProfile> = {};
      if (googleProfile.picture && !existingUser.profile_picture) {
        updates.profile_picture = googleProfile.picture;
      }
      if (!existingUser.full_name && googleProfile.name) {
        updates.full_name = googleProfile.name;
      }
      const updatedUser = Object.keys(updates).length > 0
        ? await dbService.updateUser(existingUser.id, updates)
        : existingUser;

      this.setSession(updatedUser);
      await this.notifyListeners();
      return updatedUser;
    }

    // New Google User
    const now = new Date().toISOString();
    const newUser: UserProfile = {
      id: 'usr_g_' + (googleProfile.sub || Date.now().toString()),
      auth_provider: 'google',
      provider_id: googleProfile.sub || cleanEmail,
      full_name: googleProfile.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      profile_picture: googleProfile.picture,
      onboarding_completed: false,
      created_at: now,
      updated_at: now,
    };

    const saved = await dbService.saveUser(newUser);
    this.setSession(saved);
    await this.notifyListeners();
    return saved;
  }

  // Complete Onboarding
  async completeOnboarding(userId: string, data: OnboardingData): Promise<UserProfile> {
    const user = await dbService.getUserById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    if (!data.full_name || data.full_name.trim().length < 2) {
      throw new Error('Please enter your full name.');
    }
    if (!data.university || data.university.trim().length < 2) {
      throw new Error('Please enter your university / college name.');
    }
    if (!data.department || data.department.trim().length < 2) {
      throw new Error('Please enter your course / department.');
    }
    if (!data.academic_year) {
      throw new Error('Please select your current year of study.');
    }
    if (!data.role || !['STUDENT', 'ORGANIZER'].includes(data.role)) {
      throw new Error('Please select a role (Student or Organizer).');
    }

    const updatedUser = await dbService.updateUser(userId, {
      full_name: data.full_name.trim(),
      profile_picture: data.profile_picture || user.profile_picture,
      university: data.university.trim(),
      department: data.department.trim(),
      academic_year: data.academic_year,
      role: data.role,
      onboarding_completed: true,
    });

    this.setSession(updatedUser);
    await this.notifyListeners();
    return updatedUser;
  }

  // Logout
  async logout(): Promise<void> {
    this.clearSession();
    await this.notifyListeners();
  }

  // Determine destination URL for authenticated user
  getRedirectPathForUser(user: UserProfile | null): string {
    if (!user) return '/login';
    if (!user.onboarding_completed || !user.role) return '/onboarding';
    return user.role === 'ORGANIZER' ? '/organizer' : '/student';
  }
}

export const authService = new AuthService();
