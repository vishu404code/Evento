import { CategoryType, EventItem, ClubItem, FAQItem, StatItem } from '../types';

export const CATEGORIES: Record<
  CategoryType,
  {
    name: string;
    label: string;
    badgeBg: string;
    badgeText: string;
    dotColor: string;
    borderColor: string;
  }
> = {
  ru: {
    name: 'RU Event',
    label: 'RU Official',
    badgeBg: 'bg-[#FDECEB]',
    badgeText: 'text-[#B9382C]',
    dotColor: '#B9382C',
    borderColor: 'border-[#F4C5C1]',
  },
  newton: {
    name: 'Newton Event',
    label: 'Newton School',
    badgeBg: 'bg-[#E8F1FC]',
    badgeText: 'text-[#2563A6]',
    dotColor: '#2563A6',
    borderColor: 'border-[#BCD7F5]',
  },
  club: {
    name: 'Club Event',
    label: 'Student Club',
    badgeBg: 'bg-[#E9F5EE]',
    badgeText: 'text-[#2E7D52]',
    dotColor: '#2E7D52',
    borderColor: 'border-[#BCE3CD]',
  },
  personal: {
    name: 'Personal Event',
    label: 'My Schedule',
    badgeBg: 'bg-[#EEECE9]',
    badgeText: 'text-[#615C57]',
    dotColor: '#615C57',
    borderColor: 'border-[#D9D4CE]',
  },
};

export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'HackRU 2026: 36h Code Sprint',
    category: 'newton',
    clubName: 'Newton Coding Society',
    clubInitials: 'NCS',
    date: 'Fri, Nov 14',
    time: '10:00 AM - 10:00 PM',
    location: 'Tinkering Lab, Block B',
    description: 'Annual hackathon bringing 250+ developers together to build impactful tech with mentorship from industry leaders.',
    gradient: 'from-blue-600 via-indigo-600 to-sky-500',
    tag: 'Flagship Hackathon',
    dayOfMonth: 14,
    isPopular: true,
  },
  {
    id: 'ev-2',
    title: 'Cultural Fest: Dhwani Auditions',
    category: 'club',
    clubName: 'Rishihood Music Club',
    clubInitials: 'RMC',
    date: 'Mon, Nov 17',
    time: '4:30 PM - 7:00 PM',
    location: 'Open Air Amphitheatre',
    description: 'Acoustic, vocal and band tryouts for the main stage lineup. Instruments provided, bring your best energy!',
    gradient: 'from-emerald-600 via-teal-600 to-amber-500',
    tag: 'Music & Arts',
    dayOfMonth: 17,
  },
  {
    id: 'ev-3',
    title: 'Annual Convocation Rehearsal',
    category: 'ru',
    clubName: 'Office of Academic Affairs',
    clubInitials: 'OAA',
    date: 'Wed, Nov 19',
    time: '2:00 PM - 5:00 PM',
    location: 'Main Auditorium, Ground Fl.',
    description: 'Mandatory ceremonial walk-through, gown distribution, and seated protocol briefing for graduating batch.',
    gradient: 'from-rose-600 via-red-600 to-orange-500',
    tag: 'Official RU',
    dayOfMonth: 19,
    isPopular: true,
  },
  {
    id: 'ev-4',
    title: 'Design Critique: UI/UX Portfolio Jam',
    category: 'club',
    clubName: 'Designers Guild RU',
    clubInitials: 'DGU',
    date: 'Thu, Nov 20',
    time: '5:30 PM - 7:30 PM',
    location: 'Design Studio 3',
    description: 'Bring 1 case study or wireframe deck. Get real-time constructive feedback from visiting senior product designers.',
    gradient: 'from-amber-600 via-orange-500 to-yellow-500',
    tag: 'Portfolio Review',
    dayOfMonth: 20,
  },
  {
    id: 'ev-5',
    title: 'Alumni Tech Talk: Scaled Systems',
    category: 'newton',
    clubName: 'Newton Alumni Network',
    clubInitials: 'NAN',
    date: 'Sat, Nov 22',
    time: '11:00 AM - 1:00 PM',
    location: 'Seminar Hall 2 & Live Stream',
    description: 'Ex-Newton grad now leading distributed infra at a unicorn shares war stories on scaling to 50M requests/sec.',
    gradient: 'from-cyan-600 via-blue-700 to-indigo-700',
    tag: 'Tech Talk',
    dayOfMonth: 22,
  },
  {
    id: 'ev-6',
    title: 'Inter-College Badminton Open',
    category: 'club',
    clubName: 'RU Sports Council',
    clubInitials: 'RUS',
    date: 'Sun, Nov 23',
    time: '9:00 AM - 6:00 PM',
    location: 'Indoor Sports Complex',
    description: 'Singles and doubles tournament with over 16 college teams competing for the coveted RU Chancellor Cup.',
    gradient: 'from-green-600 via-teal-700 to-lime-600',
    tag: 'Sports Tourney',
    dayOfMonth: 23,
  },
  {
    id: 'ev-7',
    title: 'Research Colloquium: Social Impact',
    category: 'ru',
    clubName: 'Dean of Research RU',
    clubInitials: 'DRU',
    date: 'Wed, Nov 26',
    time: '3:00 PM - 6:00 PM',
    location: 'Executive Conference Room',
    description: 'Faculty and student fellowship presentations on rural governance, sustainability index, and grassroots tech.',
    gradient: 'from-red-700 via-rose-800 to-stone-700',
    tag: 'Academic',
    dayOfMonth: 26,
  },
];

export const CLUBS_LIST: ClubItem[] = [
  { name: 'Newton Coding Society', initials: 'NCS', type: 'Tech', bgGradient: 'from-blue-600 to-indigo-600' },
  { name: 'Rishihood Music Club', initials: 'RMC', type: 'Arts', bgGradient: 'from-emerald-600 to-teal-700' },
  { name: 'Designers Guild', initials: 'DG', type: 'Design', bgGradient: 'from-amber-600 to-orange-600' },
  { name: 'Literary & Debating Society', initials: 'LDS', type: 'Debate', bgGradient: 'from-violet-600 to-purple-700' },
  { name: 'RU Sports Council', initials: 'RUS', type: 'Sports', bgGradient: 'from-green-600 to-emerald-700' },
  { name: 'Robotics & AI Chapter', initials: 'RAI', type: 'Tech', bgGradient: 'from-sky-600 to-blue-700' },
  { name: 'Entrepreneurship Cell', initials: 'E-CELL', type: 'Business', bgGradient: 'from-rose-600 to-red-700' },
  { name: 'Photography & Cinema Society', initials: 'PCS', type: 'Media', bgGradient: 'from-stone-700 to-neutral-900' },
  { name: 'Dramatics Society "Rang"', initials: 'RANG', type: 'Theatre', bgGradient: 'from-orange-600 to-amber-700' },
  { name: 'Social Impact Forum', initials: 'SIF', type: 'Community', bgGradient: 'from-teal-600 to-cyan-700' },
];

export const FAQ_LIST: FAQItem[] = [
  {
    question: 'Do I need to create an account or log in to browse events?',
    answer: 'No! Browsing is 100% free and open to everyone without logging in. You only need to sign in if you are a club lead or university department organizer wanting to publish official events.',
  },
  {
    question: 'Who can upload and publish events on EVENTO?',
    answer: 'Only verified Rishihood University community members holding an official @rishihood.edu.in email address can access the organizer publishing flow. This prevents spam and guarantees authentic campus announcements.',
  },
  {
    question: 'How do reminders work when I tap "Notify"?',
    answer: 'When you tap Notify, EVENTO sets up an in-browser reminder, allows one-tap export to your Google Calendar or Apple Calendar (.ics), and will soon trigger WhatsApp notification pings 1 hour before showtime.',
  },
  {
    question: 'Is EVENTO completely free for students?',
    answer: 'Yes, 100% free for all students, faculty, and organizers across Rishihood University and Newton School of Technology. No subscription fees, paywalls, or sponsored spam.',
  },
  {
    question: 'Does EVENTO work smoothly on mobile phones?',
    answer: 'Yes! EVENTO was built mobile-first. It loads in under 3 seconds, responds smoothly to finger gestures, and can even be added to your mobile home screen like a native progressive web app.',
  },
];

export const STATS_LIST: StatItem[] = [
  {
    value: 10,
    suffix: 's',
    label: 'Under 10 sec to find any event',
    description: 'Our benchmark: find room, time, and speaker details in under ten seconds without scrolling chat history.',
  },
  {
    value: 1,
    suffix: '',
    label: '1 single verified source of truth',
    description: 'Every RU official notice, Newton workshop, and club recruitment unified into one clean chronological feed.',
  },
  {
    value: 0,
    suffix: '',
    label: '0 logins needed for students',
    description: 'No passwords to remember. Instant access from any phone or laptop browser anywhere on or off campus.',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Upload Event', href: '/upload' },
];

