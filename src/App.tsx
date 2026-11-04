import React, { useState, useEffect } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { CursorGlow } from './components/CursorGlow';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClubMarquee } from './components/ClubMarquee';
import { ChaosToOrder } from './components/ChaosToOrder';
import { ScrollStory } from './components/ScrollStory';
import { NotifyShareDemo } from './components/NotifyShareDemo';
import { Features } from './components/Features';
import { StatsStrip } from './components/StatsStrip';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

// Auth and Portal Components
import { authService } from './services/authService';
import { UserProfile, UserRole } from './types/auth';
import { useAppRouter } from './utils/router';
import { LoginView } from './components/auth/LoginView';
import { OnboardingView } from './components/auth/OnboardingView';
import { PortalWrapper } from './components/portal/PortalWrapper';

export const App: React.FC = () => {
  const { route, navigate } = useAppRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize and subscribe to Auth changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Handle route redirects on user state changes
  useEffect(() => {
    if (!authInitialized) return;

    if (route === '/login') {
      if (user) {
        if (!user.onboarding_completed || !user.role) {
          navigate('/onboarding');
        } else if (user.role === 'ORGANIZER') {
          navigate('/organizer');
        } else {
          navigate('/student');
        }
      }
    } else if (route === '/onboarding') {
      if (!user) {
        navigate('/login');
      } else if (user.onboarding_completed && user.role) {
        navigate(user.role === 'ORGANIZER' ? '/organizer' : '/student');
      }
    } else if (route === '/student' || route === '/organizer') {
      if (!user) {
        navigate('/login');
      } else if (!user.onboarding_completed || !user.role) {
        navigate('/onboarding');
      }
    }
  }, [route, user, authInitialized, navigate]);

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    if (!authenticatedUser.onboarding_completed || !authenticatedUser.role) {
      navigate('/onboarding');
    } else if (authenticatedUser.role === 'ORGANIZER') {
      navigate('/organizer');
    } else {
      navigate('/student');
    }
  };

  const handleOnboardingComplete = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (updatedUser.role === 'ORGANIZER') {
      navigate('/organizer');
    } else {
      navigate('/student');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/login');
  };

  const handleSpecialNavigate = (path: string) => {
    if (path === '/home') {
      if (user) {
        navigate(user.role === 'ORGANIZER' ? '/organizer' : '/student');
      } else {
        navigate('/login');
      }
    } else if (path === '/upload') {
      if (user && user.role === 'ORGANIZER') {
        navigate('/organizer');
      } else {
        navigate('/login');
      }
    } else if (path === '/calendar') {
      const calEl = document.getElementById('calendar');
      if (calEl) {
        calEl.scrollIntoView({ behavior: 'smooth' });
      } else if (user) {
        navigate(user.role === 'ORGANIZER' ? '/organizer' : '/student');
      }
    } else {
      navigate(path);
    }
  };

  // While checking persistent session
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-terracotta border-t-transparent rounded-full animate-spin" />
          <span className="font-serif font-black text-xl tracking-tight text-charcoal">
            EVENTO
          </span>
        </div>
      </div>
    );
  }

  // 1. Login View Route
  if (route === '/login') {
    return (
      <LoginView
        onSuccess={handleAuthSuccess}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // 2. Onboarding / Basic Info View Route
  if (route === '/onboarding') {
    if (!user) {
      return null; // Redirect triggered in useEffect
    }
    return (
      <OnboardingView
        user={user}
        onComplete={handleOnboardingComplete}
        onLogout={handleLogout}
      />
    );
  }

  // 3. Student Portal Artifact Route
  if (route === '/student') {
    return (
      <PortalWrapper
        portalType="STUDENT"
        user={user}
        onLogout={handleLogout}
        onNavigateHome={() => navigate('/')}
        onNavigatePortal={(role: UserRole) => navigate(role === 'ORGANIZER' ? '/organizer' : '/student')}
      />
    );
  }

  // 4. Organizer Portal Artifact Route
  if (route === '/organizer') {
    return (
      <PortalWrapper
        portalType="ORGANIZER"
        user={user}
        onLogout={handleLogout}
        onNavigateHome={() => navigate('/')}
        onNavigatePortal={(role: UserRole) => navigate(role === 'ORGANIZER' ? '/organizer' : '/student')}
      />
    );
  }

  // 5. Default Route: Main Landing Page
  return (
    <div className="relative min-h-screen bg-beige text-charcoal flex flex-col selection:bg-terracotta/20 selection:text-terracotta-dark">
      {/* Global Scroll Progress Bar */}
      <ProgressBar />

      {/* Global Cursor Glow on Desktop */}
      <CursorGlow />

      {/* Ambient Parallax Background Blobs */}
      <BackgroundBlobs />

      {/* Sticky Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onNavigate={handleSpecialNavigate}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* Section 2 & 3: Hero & Floating Event Cards */}
        <Hero />

        {/* Section 4: Club Marquee Strip */}
        <ClubMarquee />

        {/* Section 5: WhatsApp Chaos -> EVENTO Order */}
        <ChaosToOrder />

        {/* Section 6: Pinned Scroll-Story: A Day on EVENTO */}
        <ScrollStory />

        {/* Section 9: Notify and Share Demo */}
        <NotifyShareDemo />

        {/* Section 11: Feature Highlights */}
        <Features />

        {/* Section 12: Animated Counters & Goal Promise Strip */}
        <StatsStrip />

        {/* Section 13: FAQ Accordion */}
        <FAQ />

        {/* Section 13b: Final Terracotta CTA Band */}
        <FinalCTA />
      </main>

      {/* Section 14: Footer */}
      <Footer onNavigate={handleSpecialNavigate} />
    </div>
  );
};

export default App;
