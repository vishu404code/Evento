export type CategoryType = 'ru' | 'newton' | 'club' | 'personal';

export interface EventItem {
  id: string;
  title: string;
  category: CategoryType;
  clubName: string;
  clubInitials: string;
  date: string;
  time: string;
  location: string;
  description: string;
  gradient: string;
  tag: string;
  dayOfMonth: number; // for calendar matching
  isPopular?: boolean;
}

export interface ClubItem {
  name: string;
  initials: string;
  type: string;
  bgGradient: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

