import React, { useState } from 'react';
import { Calendar, MapPin, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';
import { GoogleAuthModal } from './GoogleAuthModal';
import { UserProfile } from '../../types/auth';

interface LoginViewProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onNavigateHome }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Handle Email Auth Submit
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      let user: UserProfile;
      if (authMode === 'signup') {
        user = await authService.registerWithEmail(email, password, fullName);
      } else {
        user = await authService.loginWithEmail(email, password);
      }
      onSuccess(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth Return
  const handleGoogleSuccess = async (profile: { email: string; name: string; picture?: string; sub?: string }) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await authService.loginWithGoogle(profile);
      onSuccess(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Google Sign-In failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Logins for immediate testing
  const handleQuickDemo = async (role: 'STUDENT' | 'ORGANIZER') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const demoEmail = role === 'STUDENT' ? 'vishnu.student@rishihood.edu.in' : 'lead.organizer@rishihood.edu.in';
      const demoName = role === 'STUDENT' ? 'Vishnu Kumawat' : 'Campus Organizer';
      
      const user = await authService.loginWithGoogle({
        email: demoEmail,
        name: demoName,
        sub: 'demo_' + role.toLowerCase(),
      });

      // If new, complete onboarding automatically with demo data
      if (!user.onboarding_completed) {
        const completedUser = await authService.completeOnboarding(user.id, {
          full_name: demoName,
          email: demoEmail,
          university: 'Rishihood University',
          department: role === 'STUDENT' ? 'Newton School of Technology' : 'Student Activities Council',
          academic_year: '3rd Year',
          role: role,
        });
        onSuccess(completedUser);
      } else {
        onSuccess(user);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-terracotta/20 selection:text-terracotta-dark">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2.5 group p-1 focus:outline-none"
            aria-label="Back to home"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-terracotta text-cream flex items-center justify-center shadow-warm-md group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-6 h-6 text-cream" />
              <MapPin className="w-3.5 h-3.5 text-cream-pure absolute -bottom-0.5 -right-0.5 drop-shadow-sm fill-cream" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-black text-3xl tracking-tight text-charcoal">
                  EVENTO
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta bg-terracotta-soft/70 px-1.5 py-0.5 rounded">
                  RU
                </span>
              </div>
            </div>
          </button>

          <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-black text-charcoal tracking-tight">
            {authMode === 'signin' ? 'Welcome back to campus' : 'Create your EVENTO account'}
          </h2>
          <p className="mt-2 text-sm text-mutedbrown">
            {authMode === 'signin'
              ? 'Sign in to access your student or organizer dashboard'
              : 'Join the single verified platform for all university events'}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-cream py-8 px-6 sm:px-10 shadow-warm-xl rounded-3xl border border-beige-dark/70">
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-start gap-3 text-sm text-red-800 animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Continue with Google Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border border-beige-dark bg-white hover:bg-beige-light hover:border-terracotta/50 text-charcoal font-semibold text-sm shadow-warm-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-beige-dark/70" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cream px-3 text-mutedbrown font-semibold tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* 2. Email Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vishnu Kumawat"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. you@rishihood.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-mutedbrown hover:text-charcoal p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-terracotta hover:bg-terracotta-dark text-cream font-bold text-sm shadow-warm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In with Email' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center text-xs text-mutedbrown">
            {authMode === 'signin' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className="font-bold text-terracotta hover:underline ml-1"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                  }}
                  className="font-bold text-terracotta hover:underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Logins Banner */}
          <div className="mt-8 pt-6 border-t border-beige-dark/50">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-charcoal">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Instant Tester Profiles</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickDemo('STUDENT')}
                className="px-3 py-2 text-xs font-medium rounded-xl bg-beige-light hover:bg-beige border border-beige-dark text-charcoal text-center transition-colors hover:border-terracotta/40"
              >
                🎓 Student Profile
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickDemo('ORGANIZER')}
                className="px-3 py-2 text-xs font-medium rounded-xl bg-beige-light hover:bg-beige border border-beige-dark text-charcoal text-center transition-colors hover:border-terracotta/40"
              >
                📅 Organizer Profile
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs text-mutedbrown hover:text-terracotta transition-colors font-medium"
          >
            ← Back to EVENTO Homepage
          </button>
        </div>
      </div>

      {/* Google Sign-In Chooser Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  );
};
