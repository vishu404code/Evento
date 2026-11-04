import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  BookOpen, 
  User, 
  Mail, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { UserProfile, UserRole, OnboardingData } from '../../types/auth';

interface OnboardingViewProps {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ user, onComplete, onLogout }) => {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [university, setUniversity] = useState(user.university || 'Rishihood University');
  const [department, setDepartment] = useState(user.department || '');
  const [academicYear, setAcademicYear] = useState(user.academic_year || '2nd Year');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(user.role || null);
  const [profilePic, setProfilePic] = useState<string>(user.profile_picture || '');

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const yearOptions = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Postgraduate',
    'Faculty / Staff',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!university.trim()) {
      setValidationError('Please enter your university or college name.');
      return;
    }
    if (!department.trim()) {
      setValidationError('Please enter your course or department.');
      return;
    }
    if (!academicYear) {
      setValidationError('Please select your current year of study.');
      return;
    }
    if (!selectedRole) {
      setValidationError('Please select whether you are a Student or an Organizer.');
      return;
    }

    setIsLoading(true);
    try {
      const data: OnboardingData = {
        full_name: fullName.trim(),
        email: user.email,
        profile_picture: profilePic || user.profile_picture,
        university: university.trim(),
        department: department.trim(),
        academic_year: academicYear,
        role: selectedRole,
      };

      const updatedUser = await authService.completeOnboarding(user.id, data);
      onComplete(updatedUser);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      } else {
        setValidationError('Failed to complete setup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige py-10 px-4 sm:px-6 lg:px-8 selection:bg-terracotta/20 selection:text-terracotta-dark">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-beige-dark/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-terracotta text-cream flex items-center justify-center shadow-warm-sm">
              <Calendar className="w-5 h-5 text-cream" />
            </div>
            <div>
              <span className="font-serif font-black text-xl tracking-tight text-charcoal">
                EVENTO
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta bg-terracotta-soft/70 px-1.5 py-0.5 rounded ml-1.5">
                Onboarding
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            type="button"
            className="text-xs font-semibold text-mutedbrown hover:text-charcoal px-3 py-1.5 rounded-full border border-beige-dark bg-cream hover:bg-beige transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Title & Introduction */}
        <div className="mt-8 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-bold text-terracotta mb-2">
            Step 1 of 1 · Basic Information
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-charcoal tracking-tight">
            Tell us about yourself
          </h1>
          <p className="mt-2 text-sm sm:text-base text-mutedbrown max-w-2xl">
            We personalize your campus experience based on your program and role. You can update these details anytime.
          </p>
        </div>

        {/* Error notification */}
        {validationError && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-start gap-3 text-sm text-red-800 animate-in fade-in duration-150">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Main Info Card */}
          <div className="bg-cream rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-beige-dark/70 space-y-6">
            <h2 className="font-serif font-bold text-lg text-charcoal border-b border-beige-dark/40 pb-3">
              1. Academic & Personal Profile
            </h2>

            <div className="flex items-center gap-4 pb-4 border-b border-beige-dark/40">
              <div className="w-16 h-16 rounded-full bg-terracotta text-cream flex items-center justify-center font-bold text-xl shadow-warm-sm overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName ? fullName.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Profile Picture (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://... image URL"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta outline-none w-64"
                  />
                  {profilePic && (
                    <button
                      type="button"
                      onClick={() => setProfilePic('')}
                      className="text-xs text-mutedbrown hover:text-red-600 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-emerald-600">(Verified)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-beige-light/60 border border-beige-dark/50 text-mutedbrown cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* University Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  University / College Name <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Rishihood University"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                  />
                </div>
              </div>

              {/* Course / Department */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Course / Department <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-mutedbrown absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Newton School of Technology - CS"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/50 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                  />
                </div>
              </div>

              {/* Current Year of Study */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Current Year of Study <span className="text-terracotta">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {yearOptions.map((yr) => (
                    <button
                      type="button"
                      key={yr}
                      onClick={() => setAcademicYear(yr)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        academicYear === yr
                          ? 'border-terracotta bg-terracotta text-cream shadow-warm-sm'
                          : 'border-beige-dark bg-beige-light text-charcoal hover:bg-beige'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="bg-cream rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-beige-dark/70 space-y-6">
            <div>
              <h2 className="font-serif font-bold text-lg text-charcoal">
                2. Select Your Primary Role <span className="text-terracotta">*</span>
              </h2>
              <p className="text-xs text-mutedbrown mt-1">
                This dictates which portal dashboard is launched for you. Choose the one that represents your role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CARD 1 – STUDENT */}
              <div
                onClick={() => setSelectedRole('STUDENT')}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 flex flex-col justify-between group ${
                  selectedRole === 'STUDENT'
                    ? 'border-terracotta bg-terracotta-soft/30 shadow-warm'
                    : 'border-beige-dark/80 bg-white hover:border-terracotta/40 hover:bg-beige-light/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedRole === 'STUDENT'
                          ? 'bg-terracotta text-cream'
                          : 'bg-beige-light text-terracotta group-hover:bg-terracotta/10'
                      }`}
                    >
                      <GraduationCap className="w-6 h-6" />
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedRole === 'STUDENT'
                          ? 'border-terracotta bg-terracotta text-cream'
                          : 'border-beige-dark bg-white'
                      }`}
                    >
                      {selectedRole === 'STUDENT' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-charcoal group-hover:text-terracotta transition-colors">
                    Student
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-mutedbrown leading-relaxed">
                    Explore university events, register for activities, discover opportunities, and manage your event participation.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-beige-dark/40 flex items-center gap-2 text-xs font-semibold text-terracotta">
                  <span>Student Artifact Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* CARD 2 – ORGANIZER */}
              <div
                onClick={() => setSelectedRole('ORGANIZER')}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 flex flex-col justify-between group ${
                  selectedRole === 'ORGANIZER'
                    ? 'border-terracotta bg-terracotta-soft/30 shadow-warm'
                    : 'border-beige-dark/80 bg-white hover:border-terracotta/40 hover:bg-beige-light/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedRole === 'ORGANIZER'
                          ? 'bg-terracotta text-cream'
                          : 'bg-beige-light text-terracotta group-hover:bg-terracotta/10'
                      }`}
                    >
                      <Calendar className="w-6 h-6" />
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedRole === 'ORGANIZER'
                          ? 'border-terracotta bg-terracotta text-cream'
                          : 'border-beige-dark bg-white'
                      }`}
                    >
                      {selectedRole === 'ORGANIZER' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-charcoal group-hover:text-terracotta transition-colors">
                    Organizer
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-mutedbrown leading-relaxed">
                    Create and manage university events, handle registrations, and manage event activities.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-beige-dark/40 flex items-center gap-2 text-xs font-semibold text-terracotta">
                  <span>Organizer Artifact Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Continue Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-mutedbrown">
              By continuing, your profile and role will be saved permanently.
            </span>

            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-dark text-cream font-bold text-sm shadow-warm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Profile & Open {selectedRole === 'ORGANIZER' ? 'Organizer' : 'Student'} Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
