import React, { useState } from 'react';
import { X, ArrowRight, Zap, Train, Bus, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { TRANSIT_ROUTES, TransitRoute } from '../data/transitData';

interface FareComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (route: TransitRoute) => void;
}

const COMPARISON_DESTINATIONS = ['Kandy', 'Galle', 'Matara', 'Badulla', 'Jaffna', 'Vavuniya', 'Batticaloa'];

export const FareComparatorModal: React.FC<FareComparatorModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute,
}) => {
  const [selectedDest, setSelectedDest] = useState<string>('Kandy');

  if (!isOpen) return null;

  // Find all routes serving this destination
  const matchedRoutes = TRANSIT_ROUTES.filter(
    (r) =>
      r.destinationEn.toLowerCase().includes(selectedDest.toLowerCase()) ||
      r.viaStops.some((s) => s.toLowerCase().includes(selectedDest.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#0f141e] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/40">
                Mode Comparison
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Compare Transit Modes & Fares</h2>
            <p className="text-xs text-slate-400">
              Highway Expressway Bus vs Scenic Railway vs CTB State Bus
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination selector chips */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 shrink-0 mr-1">Destination:</span>
          {COMPARISON_DESTINATIONS.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDest(dest)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                selectedDest === dest
                  ? 'bg-[#FF9F0A] text-slate-950 font-semibold shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>

        {/* Comparison list */}
        <div className="p-5 overflow-y-auto space-y-3">
          {matchedRoutes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No direct comparisons available for {selectedDest}.
            </div>
          ) : (
            matchedRoutes.map((route) => (
              <div
                key={route.id}
                onClick={() => {
                  onSelectRoute(route);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        route.isExpressway
                          ? 'bg-amber-500/20 text-[#FF9F0A]'
                          : route.transportType === 'train'
                          ? 'bg-emerald-500/20 text-[#30D158]'
                          : 'bg-blue-500/20 text-[#0A84FF]'
                      }`}
                    >
                      {route.routeNumber}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {route.destinationEn}{' '}
                      <span className="font-sinhala text-slate-400 font-normal">
                        ({route.destinationSi})
                      </span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>From: {route.originEn}</span>
                    <span>·</span>
                    <span className="text-slate-300 font-medium">{route.serviceType}</span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2 pt-0.5">
                    <Clock className="w-3 h-3 text-[#0A84FF]" />
                    <span>
                      {route.frequency ||
                        (route.specificDepartures ? route.specificDepartures.join(', ') : 'Daily')}
                    </span>
                    <span>·</span>
                    <span>Est: {route.estimatedDuration}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                  <span className="text-sm sm:text-base font-bold text-[#30D158] tabular-nums font-poppins">
                    {route.fare}
                  </span>
                  <span className="text-[11px] text-[#0A84FF] group-hover:underline flex items-center gap-1 mt-0.5">
                    <span>View Schedule</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
