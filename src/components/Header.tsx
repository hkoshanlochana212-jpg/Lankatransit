import React from 'react';
import { Clock, Bookmark, PhoneCall, Globe2, Sparkles, MapPin } from 'lucide-react';
import heroImage from '../assets/images/sri_lanka_transit_hero_1790248077024.jpg';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentSlTime: string;
  savedCount: number;
  activeFilter: string;
  onSelectFavorites: () => void;
  onOpenEmergency: () => void;
  languageMode: 'all' | 'en' | 'si' | 'ta';
  onSelectLanguage: (lang: 'all' | 'en' | 'si' | 'ta') => void;
  useSriLankaTime: boolean;
  onToggleTimeMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSlTime,
  savedCount,
  activeFilter,
  onSelectFavorites,
  onOpenEmergency,
  languageMode,
  onSelectLanguage,
  useSriLankaTime,
  onToggleTimeMode,
}) => {
  return (
    <header className="relative overflow-hidden border-b border-slate-800 bg-[#0d1117]">
      {/* Background Hero Banner with High Quality Scenic Sri Lanka Train & Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Sri Lanka Transit Scenic Train across Nine Arch Bridge"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
          onError={(e) => {
            // Fallback to user specified Unsplash image if local asset fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        {/* Measured dark scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0d1117]/85 to-[#0b0e14]/75" />
        <div className="absolute inset-0 bg-radial-at-t from-[#FF9F0A]/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-5 pb-6 sm:px-6 lg:px-8">
        {/* Top utility bar */}
        <div className="flex items-center justify-between gap-3 text-xs mb-4">
          {/* Live time indicator */}
          <button
            onClick={onToggleTimeMode}
            title="Click to toggle Sri Lanka Time (SLST UTC+5:30) or Local Device Time"
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-[#FF9F0A]/50 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-[#FF9F0A] animate-pulse" />
            <span className="tabular-nums font-medium text-slate-100">{currentSlTime}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {useSriLankaTime ? 'SLST (UTC+5:30)' : 'Local Time'}
            </span>
          </button>

          {/* Quick buttons: PWA Install, Emergency hotline & Saved Bookmarks */}
          <div className="flex items-center gap-2">
            <PWAInstallButton variant="header" />

            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/50 text-red-300 hover:bg-red-900/60 hover:text-white transition-colors"
              title="Transit Emergency Hotlines (1969 / 1958 / 1955 / 1971)"
            >
              <PhoneCall className="w-3 h-3 text-red-400" />
              <span className="font-medium text-[11px]">Hotlines</span>
            </button>

            <button
              onClick={onSelectFavorites}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                activeFilter === 'saved'
                  ? 'bg-[#FF9F0A] text-slate-950 border-[#FF9F0A] font-semibold'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-500/50'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${activeFilter === 'saved' ? 'fill-slate-950 text-slate-950' : 'text-[#FF9F0A]'}`} />
              <span className="font-medium text-[11px]">Saved ({savedCount})</span>
            </button>
          </div>
        </div>

        {/* Brand identity & titles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9F0A] to-[#0A84FF] flex items-center justify-center shadow-lg shadow-amber-500/20">
                <MapPin className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-baseline gap-2 font-poppins">
                  <span>Lanka Transit</span>
                  <span className="text-[#FF9F0A] font-normal text-lg sm:text-xl font-sinhala">
                    ලංකා ට්රාන්සිට්
                  </span>
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl text-wrap-balance">
              Official Sri Lanka Public Transit Schedules for Makumbura MMC Expressway, Pettah Private & CTB Bus Terminals, and Colombo Fort Railway.
            </p>
          </div>

          {/* Language selector segmented control */}
          <div className="flex items-center self-start md:self-end bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
            <div className="flex items-center gap-1 text-[11px] px-2 text-slate-400">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Lang:</span>
            </div>
            <button
              onClick={() => onSelectLanguage('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                languageMode === 'all'
                  ? 'bg-gradient-to-r from-[#FF9F0A] to-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trilingual
            </button>
            <button
              onClick={() => onSelectLanguage('si')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium font-sinhala transition-all ${
                languageMode === 'si'
                  ? 'bg-[#FF9F0A] text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              සිංහල
            </button>
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                languageMode === 'en'
                  ? 'bg-[#0A84FF] text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onSelectLanguage('ta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium font-tamil transition-all ${
                languageMode === 'ta'
                  ? 'bg-[#30D158] text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Highlight ticker / notice */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF9F0A]" />
            <span>Updated with official Makumbura Highway, SLTB, NTC & Railway fares & departure intervals.</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>🇱🇰 Sri Lanka Transport Gateway</span>
          </div>
        </div>
      </div>
    </header>
  );
};
