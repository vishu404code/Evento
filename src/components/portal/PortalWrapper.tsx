import React from 'react';
import { UserProfile, UserRole } from '../../types/auth';
import { StudentPortalIntegration } from './StudentPortalIntegration';
import { OrganizerPortalIntegration } from './OrganizerPortalIntegration';

interface PortalWrapperProps {
  portalType: 'STUDENT' | 'ORGANIZER';
  user: UserProfile | null;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigatePortal: (role: UserRole) => void;
}

export const PortalWrapper: React.FC<PortalWrapperProps> = ({
  portalType,
  user,
  onLogout,
  onNavigateHome,
  onNavigatePortal,
}) => {
  if (portalType === 'STUDENT') {
    return (
      <StudentPortalIntegration
        user={user}
        onLogout={onLogout}
        onNavigateHome={onNavigateHome}
        onNavigatePortal={onNavigatePortal}
      />
    );
  }

  return (
    <OrganizerPortalIntegration
      user={user}
      onLogout={onLogout}
      onNavigateHome={onNavigateHome}
      onNavigatePortal={onNavigatePortal}
    />
  );
};
