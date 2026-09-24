import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  Check,
  PhoneCall,
  Calendar,
  AlertCircle,
  Coins,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { TransitRoute, TRANSIT_STATIONS } from '../data/transitData';
import { DepartureStatus } from '../utils/timeUtils';

interface RouteModalProps {
  route: TransitRoute | null;
  onClose: () => void;
  status: DepartureStatus | null;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  languageMode: 'all' | 'en' | 'si' | 'ta';
}

export const RouteModal: React.FC<RouteModalProps> = ({
  route,
  onClose,
  status,
  isSaved,
  onToggleSave,
  languageMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!route) return null;

  const station = TRANSIT_STATIONS.find((s) => s.id === route.stationId);

  // Approximate conversions for foreign travelers (1 USD ~ 300 LKR, 1 EUR ~ 325 LKR)
  const usdMin = (route.minFare / 300).toFixed(2);

  const handleShare = async () => {
    const textToShare = `🇱🇰 Lanka Transit Schedule:
Route: ${route.routeNumber} - ${route.destinationEn} (${route.destinationSi})
Origin: ${route.originEn}
Departures: ${
      route.specificDepartures
        ? route.specificDepartures.join(', ')
        : `First: ${route.firstDeparture} | Last: ${route.lastDeparture} (${route.frequency})`
    }
Fare: ${route.fare}
Terminal: ${station?.nameEn} (${route.busBayOrPlatform})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lanka Transit - ${route.routeNumber} to ${route.destinationEn}`,
          text: textToShare,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(textToShare);
      }
    } else {
      copyToClipboard(textToShare);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full sm:max-w-xl bg-[#0f141d] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
        {/* Drag handle for mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold font-poppins tabular-nums ${
                  route.isExpressway
                    ? 'bg-amber-500/20 text-[#FF9F0A] border border-[#FF9F0A]/40'
                    : route.transportType === 'train'
                    ? 'bg-emerald-500/20 text-[#30D158] border border-[#30D158]/40'
                    : 'bg-blue-500/20 text-[#0A84FF] border border-[#0A84FF]/40'
                }`}
              >
                {route.routeNumber}
              </span>
              <span className="text-xs text-slate-400 font-medium">{route.serviceType}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white flex flex-wrap items-baseline gap-2">
              <span>{route.destinationEn}</span>
              <span className="text-[#FF9F0A] text-lg font-sinhala font-normal">
                {route.destinationSi}
              </span>
              <span className="text-slate-400 text-sm font-tamil font-normal">
                {route.destinationTa}
              </span>
            </h2>

            {route.trainName && (
              <p className="text-xs text-[#FF9F0A] font-medium">{route.trainName}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleSave(route.id)}
              className={`p-2 rounded-xl transition-colors ${
                isSaved
                  ? 'bg-amber-500/20 text-[#FF9F0A]'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#FF9F0A]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 text-sm text-slate-300">
          {/* Status & Terminal quick badge */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block">Boarding Terminal</span>
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF9F0A]" />
                <span>{station?.shortName}</span>
                <span className="text-slate-400 text-xs">({route.busBayOrPlatform})</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Current Status</span>
              <span
                className={`font-semibold tabular-nums ${
                  status?.state === 'boarding-soon'
                    ? 'text-amber-400 animate-pulse'
                    : status?.state === 'upcoming'
                    ? 'text-[#0A84FF]'
                    : status?.state === 'frequency-active'
                    ? 'text-[#30D158]'
                    : 'text-slate-300'
                }`}
              >
                {status?.label || 'Operating'}
              </span>
            </div>
          </div>

          {/* Departure Timetable Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span>Timetable & Departures</span>
            </h3>

            {route.specificDepartures && route.specificDepartures.length > 0 ? (
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400 mb-2">
                  Scheduled daily departure times from {route.originEn}:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {route.specificDepartures.map((time, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-semibold text-slate-100 tabular-nums text-sm shadow-sm"
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">First Departure</span>
                  <span className="text-base font-bold text-white tabular-nums">
                    {route.firstDeparture}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Last Departure</span>
                  <span className="text-base font-bold text-white tabular-nums">
                    {route.lastDeparture}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Frequency</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#0A84FF]">
                    {route.frequency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Fare & Currency Preview */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Coins className="w-4 h-4 text-[#30D158]" />
                <span>Ticket Fare Information</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Est. ~${usdMin} USD
              </span>
            </div>

            <div className="text-2xl font-bold text-[#30D158] tabular-nums font-poppins">
              {route.fare}
            </div>

            {route.fareNote && (
              <p className="text-xs text-slate-300">{route.fareNote}</p>
            )}
          </div>

          {/* Route Stops / Stations along the way */}
          {route.viaStops && route.viaStops.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#FF9F0A]" />
                <span>Route Corridor & Key Stops</span>
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex flex-col gap-2">
                  {route.viaStops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            idx === 0
                              ? 'bg-[#0A84FF]'
                              : idx === route.viaStops.length - 1
                              ? 'bg-[#30D158]'
                              : 'bg-[#FF9F0A]'
                          }`}
                        />
                        {idx < route.viaStops.length - 1 && (
                          <div className="w-0.5 h-4 bg-slate-700 my-0.5" />
                        )}
                      </div>
                      <span
                        className={`${
                          idx === 0 || idx === route.viaStops.length - 1
                            ? 'font-semibold text-slate-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {stop}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Terminal Contact & Information */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">{station?.nameEn}</span>
              <span className="text-slate-300 font-medium">Hotline: {station?.hotline}</span>
            </div>
            <a
              href={`tel:${station?.hotline?.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span>Call Desk</span>
            </a>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex-1 h-11 rounded-xl bg-[#FF9F0A] hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Schedule Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>Share Schedule</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
