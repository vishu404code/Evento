import { useState, useEffect } from 'react';

export type AppRoute = '/' | '/login' | '/onboarding' | '/student' | '/organizer';

export function normalizeRoute(path: string): AppRoute {
  // Support hash routing (e.g. #/student, #student) or pathname (/student)
  let clean = path.split('?')[0].split('#')[0];
  if (path.includes('#')) {
    const hashPart = path.split('#')[1] || '';
    if (hashPart.startsWith('/')) {
      clean = hashPart.split('?')[0];
    } else if (hashPart === 'student' || hashPart === 'organizer' || hashPart === 'login' || hashPart === 'onboarding') {
      clean = '/' + hashPart;
    }
  }

  if (clean.endsWith('.html')) {
    if (clean.includes('student')) return '/student';
    if (clean.includes('organizer')) return '/organizer';
  }

  if (clean === '/student' || clean.startsWith('/student')) return '/student';
  if (clean === '/organizer' || clean.startsWith('/organizer')) return '/organizer';
  if (clean === '/login' || clean.startsWith('/login')) return '/login';
  if (clean === '/onboarding' || clean.startsWith('/onboarding')) return '/onboarding';
  return '/';
}

export function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return '/';
  
  // First check hash
  if (window.location.hash) {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return normalizeRoute(hash.substring(1));
    }
  }
  
  return normalizeRoute(window.location.pathname);
}

export function navigate(to: string): void {
  if (typeof window === 'undefined') return;
  const targetRoute = normalizeRoute(to);
  
  // Update browser history
  window.history.pushState({}, '', targetRoute);
  
  // Dispatch custom popstate event so listeners update
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useAppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getCurrentRoute());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return {
    route: currentRoute,
    navigate,
  };
}

