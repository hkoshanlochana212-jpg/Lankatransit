import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notification"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-2xl shadow-amber-500/20 border border-amber-300 animate-bounce-short"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
        <span>Offline Mode — Using Cached Schedules</span>
      </div>
      <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-mono font-bold">
        PWA Active
      </span>
    </aside>
  );
};
