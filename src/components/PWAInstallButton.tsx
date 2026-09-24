import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Direct user with helpful tip for browsers that haven't fired prompt yet
      setShowIOSGuide(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-[#FF9F0A]/40 shadow-lg shadow-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9F0A] flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Install Lanka Transit Web App</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30">
                  Standalone PWA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant access to bus & train timetables right from your home screen with offline schedule caching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="px-4 py-2 rounded-xl bg-[#FF9F0A] hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalling ? 'Installing...' : 'Install Native App'}</span>
            </button>
          </div>
        </div>

        {/* iOS / Manual Installation modal guide */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm rounded-3xl bg-[#111622] border border-slate-700 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF9F0A] flex items-center justify-center text-slate-950">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Install on Device</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-[#0A84FF] shrink-0 mt-0.5">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Step 1</span>
                    <span>Tap the <strong>Share</strong> icon in your browser's bottom or top navigation toolbar.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-[#FF9F0A] shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Step 2</span>
                    <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-[#30D158] shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Step 3</span>
                    <span>Tap <strong>"Add"</strong> in the top right. Lanka Transit is now available as a full-screen standalone application!</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Header compact button variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF9F0A] to-amber-500 text-slate-950 font-bold text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all"
        title="Install Lanka Transit as a standalone Progressive Web App"
      >
        <Download className="w-3 h-3 text-slate-950" />
        <span>Install App</span>
      </button>

      {/* iOS / Manual Installation modal guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#111622] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF9F0A] flex items-center justify-center text-slate-950">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Install on Device</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-[#0A84FF] shrink-0 mt-0.5">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Step 1</span>
                  <span>Tap the <strong>Share</strong> button in Safari or your browser toolbar.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-[#FF9F0A] shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Step 2</span>
                  <span>Select <strong>"Add to Home Screen"</strong> from the menu options.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-[#30D158] shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Step 3</span>
                  <span>Launch Lanka Transit anytime as a standalone app!</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
