import React, { useRef, useEffect, useState } from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Home, GraduationCap } from 'lucide-react';
import { UserProfile, UserRole } from '../../types/auth';

interface StudentPortalIntegrationProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigatePortal: (role: UserRole) => void;
}

export const StudentPortalIntegration: React.FC<StudentPortalIntegrationProps> = ({
  user,
  onLogout,
  onNavigateHome,
  onNavigatePortal,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Absolute URL guaranteed to resolve to root /student.html regardless of pathname or trailing slashes
  const artifactUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/student.html`
    : '/student.html';

  // Role Access Guard: Student portal is restricted to STUDENT accounts
  const isAccessDenied = !user || user.role !== 'STUDENT';

  // Preload artifact content via fetch as an instant-load & offline fallback
  useEffect(() => {
    let isMounted = true;
    fetch(artifactUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load Student Portal (HTTP ${res.status})`);
        }
        return res.text();
      })
      .then((html) => {
        if (isMounted) {
          setHtmlContent(html);
        }
      })
      .catch((err) => {
        console.warn('Student portal direct fetch notice:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [artifactUrl]);

  // Synchronize authenticated user profile into artifact DOM & intercept logout
  const handleIframeLoad = () => {
    try {
      const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      if (!iframeDoc || !user) return;

      // Update user display name in the artifact header
      const nameEl = iframeDoc.querySelector('#ab .nm b');
      if (nameEl && user.full_name) {
        nameEl.textContent = user.full_name;
      }
      const roleEl = iframeDoc.querySelector('#rl');
      if (roleEl) {
        roleEl.textContent = 'Student';
      }
      const avatarEl = iframeDoc.querySelector('#ab .c');
      if (avatarEl && user.full_name) {
        avatarEl.textContent = user.full_name.charAt(0).toUpperCase();
      }

      // Connect artifact's native logout buttons (#out and #out2) to app auth session
      const out1 = iframeDoc.getElementById('out');
      const out2 = iframeDoc.getElementById('out2');
      const handleArtifactLogout = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        onLogout();
      };

      if (out1) out1.addEventListener('click', handleArtifactLogout);
      if (out2) out2.addEventListener('click', handleArtifactLogout);
    } catch {
      // Graceful fallback for cross-origin browsing contexts
    }
  };

  // Access Denied Screen: Blocks Organizers or unauthenticated users from Student Portal
  if (isAccessDenied) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream rounded-3xl p-8 shadow-warm-xl border border-beige-dark/70 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5 shadow-warm-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="font-serif font-black text-2xl text-charcoal tracking-tight">
            Access Restricted
          </h2>

          <p className="mt-3 text-sm text-mutedbrown leading-relaxed">
            {user ? (
              <>
                You are currently signed in as an <strong className="text-charcoal">{user.role}</strong> ({user.email}). 
                The Student Portal is reserved exclusively for Student accounts.
              </>
            ) : (
              'You must be signed in with authorized university credentials to view this dashboard.'
            )}
          </p>

          <div className="mt-8 space-y-3">
            {user && user.role && (
              <button
                type="button"
                onClick={() => onNavigatePortal(user.role as UserRole)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-terracotta hover:bg-terracotta-dark text-cream font-bold text-sm shadow-warm transition-all"
              >
                <span>Go to your {user.role === 'ORGANIZER' ? 'Organizer' : 'Student'} Dashboard</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-beige-dark bg-white hover:bg-beige-light text-charcoal font-semibold text-sm transition-all"
            >
              <Home className="w-4 h-4 text-mutedbrown" />
              <span>Back to EVENTO Home</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign in with a different account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#f5ede4]">
      {/* Top Floating Integration Control Pill */}
      <header className="fixed top-2.5 right-4 z-40 flex items-center gap-2 bg-[#fffaf4]/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#e6d6c3] shadow-md transition-all">
        {/* User Identity Chip */}
        <div className="flex items-center gap-2 pr-2 border-r border-[#e6d6c3]">
          <div className="w-6 h-6 rounded-full bg-[#E8590C] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <span className="block text-xs font-bold text-[#2a2420] truncate max-w-[130px]">
              {user.full_name}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-[#7a6e63] font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3 h-3 text-[#E8590C]" />
              <span>Student</span>
            </div>
          </div>
        </div>

        {/* Back to Website Button */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#2a2420] hover:text-[#E8590C] hover:bg-[#f5ede4] rounded-xl transition-colors"
          title="Return to EVENTO Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Website</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#E5484D] hover:bg-red-50 rounded-xl transition-colors"
          title="Sign out of your session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Main Student Portal Frame with dual-defense src and srcDoc */}
      <main className="flex-1 w-full h-full relative">
        <iframe
          ref={iframeRef}
          src={artifactUrl}
          srcDoc={htmlContent || undefined}
          title="EVENTO Student Portal"
          className="w-full h-full border-0 absolute inset-0"
          onLoad={handleIframeLoad}
          onError={() => setLoadError('Unable to render Student Portal. Please reload.')}
        />
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-beige p-4 text-center">
            <p className="text-sm text-red-600 font-semibold">{loadError}</p>
          </div>
        )}
      </main>
    </div>
  );
};

