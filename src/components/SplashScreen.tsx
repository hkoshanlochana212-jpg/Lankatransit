import React, { useEffect, useState } from 'react';
import heroImage from '../assets/images/sri_lanka_transit_hero_1790248077024.jpg';
import { Train, Bus, Zap, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Connecting to Sri Lanka Transit Network...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Sequence loading stages smoothly
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Syncing Makumbura MMC & Southern Expressway routes...');
    }, 450);

    const t2 = setTimeout(() => {
      setProgress(78);
      setStatusText('Loading Colombo Fort Railway & Pettah CTB schedules...');
    }, 950);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready for departure · සාදරයෙන් පිළිගනිමු!');
    }, 1500);

    const t4 = setTimeout(() => {
      setIsFading(true);
    }, 1900);

    const t5 = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 bg-[#0D0D0E] text-white select-none transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Scenic Rail Hero Image with dark cinematic gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroImage}
          alt="Sri Lanka Scenic Rail Nine Arch Bridge"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        {/* Layered dark vignette for maximum visual punch */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0E] via-[#0D0D0E]/80 to-[#0D0D0E]/60" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0D0D0E]/40 to-[#0D0D0E]" />
      </div>

      {/* Top Bar Pill */}
      <div className="relative z-10 w-full flex justify-between items-center text-xs text-slate-400">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FF9F0A] animate-ping" />
          <span className="text-slate-200 font-medium">Lanka Transit PWA</span>
        </span>

        <button
          onClick={onFinish}
          className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 backdrop-blur-md transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Center Brand Lockup */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md my-auto space-y-5">
        {/* Glowing Logo Icon */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#FF9F0A] to-[#0A84FF] opacity-40 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#141824] border-2 border-[#FF9F0A]/60 flex items-center justify-center shadow-2xl">
            <div className="relative">
              <Train className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF9F0A]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A84FF] flex items-center justify-center border-2 border-[#141824]">
                <Bus className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Trilingual Title */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-poppins drop-shadow-md">
            Lanka Transit
          </h1>
          <p className="text-xl sm:text-2xl text-[#FF9F0A] font-sinhala font-medium">
            ලංකා ට්රාන්සිට්
          </p>
          <p className="text-xs text-slate-400 font-tamil tracking-wide">
            இலங்கை போக்குவரத்து அட்டவணை
          </p>
        </div>

        {/* Scenic Rail Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300 text-xs backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9F0A]" />
          <span>Nine Arch Bridge & National Transit Guide</span>
        </div>
      </div>

      {/* Bottom Loading Progress Indicator */}
      <div className="relative z-10 w-full max-w-sm space-y-3 mb-4">
        {/* Track with moving transit vehicle */}
        <div className="relative w-full">
          {/* Progress bar container */}
          <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-[#FF9F0A] via-amber-400 to-[#0A84FF] rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status text & progress % */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 truncate max-w-[240px] text-[11px] font-medium">
            {statusText}
          </span>
          <span className="text-[#FF9F0A] font-mono font-bold tabular-nums">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
