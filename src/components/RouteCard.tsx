import React from 'react';
import {
  Clock,
  MapPin,
  Bookmark,
  Share2,
  ChevronRight,
  Sparkles,
  Train,
  Bus,
  Calendar,
  Zap,
} from 'lucide-react';
import { TransitRoute } from '../data/transitData';
import { DepartureStatus } from '../utils/timeUtils';

interface RouteCardProps {
  route: TransitRoute;
  status: DepartureStatus;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (route: TransitRoute) => void;
  languageMode: 'all' | 'en' | 'si' | 'ta';
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  status,
  isSaved,
  onToggleSave,
  onOpenDetails,
  languageMode,
}) => {
  const isTrain = route.transportType === 'train';

  const renderDestinations = () => {
    if (languageMode === 'en') {
      return (
        <div>
          <span className="text-base sm:text-lg font-bold text-white tracking-tight">
            {route.destinationEn}
          </span>
          {route.trainName && (
            <div className="text-xs text-[#FF9F0A] font-medium mt-0.5">
              {route.trainName}
            </div>
          )}
        </div>
      );
    }

    if (languageMode === 'si') {
      return (
        <div>
          <span className="text-base sm:text-lg font-bold text-white font-sinhala tracking-tight">
            {route.destinationSi}
          </span>
          {route.trainName && (
            <div className="text-xs text-[#FF9F0A] font-sinhala font-medium mt-0.5">
              {route.trainName}
            </div>
          )}
        </div>
      );
    }

    if (languageMode === 'ta') {
      return (
        <div>
          <span className="text-base sm:text-lg font-bold text-white font-tamil tracking-tight">
            {route.destinationTa}
          </span>
          {route.trainName && (
            <div className="text-xs text-[#FF9F0A] font-tamil font-medium mt-0.5">
              {route.trainName}
            </div>
          )}
        </div>
      );
    }

    // Trilingual Unified Mode
    return (
      <div className="space-y-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base sm:text-lg font-bold text-white tracking-tight font-poppins">
            {route.destinationEn}
          </span>
          <span className="text-sm font-semibold text-slate-300 font-sinhala">
            {route.destinationSi}
          </span>
          <span className="text-xs font-normal text-slate-400 font-tamil">
            {route.destinationTa}
          </span>
        </div>
        {route.trainName && (
          <div className="text-xs text-[#FF9F0A] font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF9F0A]" />
            <span>{route.trainName}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => onOpenDetails(route)}
      className="group relative rounded-2xl bg-[#111620]/90 hover:bg-[#141b27] border border-slate-800 hover:border-slate-700 p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Route Badge with transport blue or highway saffron gold */}
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide font-poppins tabular-nums flex items-center gap-1.5 ${
              route.isExpressway
                ? 'bg-amber-500/15 text-[#FF9F0A] border border-[#FF9F0A]/40'
                : isTrain
                ? 'bg-emerald-500/15 text-[#30D158] border border-[#30D158]/40'
                : 'bg-blue-500/15 text-[#0A84FF] border border-[#0A84FF]/40'
            }`}
          >
            {route.isExpressway ? (
              <Zap className="w-3 h-3 text-[#FF9F0A]" />
            ) : isTrain ? (
              <Train className="w-3 h-3 text-[#30D158]" />
            ) : (
              <Bus className="w-3 h-3 text-[#0A84FF]" />
            )}
            <span>{route.routeNumber}</span>
          </div>

          {/* Service Tag metadata */}
          <span className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-xs">
            {route.serviceType}
          </span>
        </div>

        {/* Action icons (Bookmark & chevron) */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(route.id);
            }}
            title={isSaved ? 'Remove from saved' : 'Save route to favorites'}
            className={`p-2 rounded-lg transition-colors ${
              isSaved
                ? 'text-[#FF9F0A] hover:bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#FF9F0A]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Destination & Trilingual labels */}
      <div className="mb-3.5">{renderDestinations()}</div>

      {/* Origin -> Destination Route Path */}
      <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5 truncate">
        <span className="text-slate-400">{route.originEn}</span>
        <span className="text-slate-400">→</span>
        <span className="text-slate-300 font-medium">{route.destinationEn}</span>
        {route.estimatedDuration && (
          <>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">{route.estimatedDuration} est.</span>
          </>
        )}
      </div>

      {/* Schedule timing & intervals section */}
      <div className="py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3.5">
        {route.specificDepartures && route.specificDepartures.length > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0A84FF]" />
                <span>Departures:</span>
              </span>
              <span className="text-slate-400 text-[11px]">{route.frequency || 'Scheduled'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {route.specificDepartures.map((time, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-850 border border-slate-700/70 text-slate-200 font-medium tabular-nums text-xs"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-400 text-[11px] block">First Bus</span>
                <span className="font-semibold text-slate-200 tabular-nums">
                  {route.firstDeparture || '—'}
                </span>
              </div>
              <span className="text-slate-400">·</span>
              <div>
                <span className="text-slate-400 text-[11px] block">Last Bus</span>
                <span className="font-semibold text-slate-200 tabular-nums">
                  {route.lastDeparture || '—'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Interval</span>
              <span className="font-semibold text-[#0A84FF]">{route.frequency}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Fares (#30D158) & Status indicator */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        {/* Fresh Green Price Tag */}
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Ticket Fare
          </span>
          <span className="text-sm sm:text-base font-bold text-[#30D158] tabular-nums font-poppins">
            {route.fare}
          </span>
        </div>

        {/* Departure Status / Bay info */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span
              className={`text-xs font-medium block tabular-nums ${
                status.state === 'boarding-soon'
                  ? 'text-amber-400 font-bold animate-pulse'
                  : status.state === 'upcoming'
                  ? 'text-[#0A84FF]'
                  : status.state === 'frequency-active'
                  ? 'text-[#30D158]'
                  : 'text-slate-400'
              }`}
            >
              {status.label}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
              <MapPin className="w-2.5 h-2.5 text-slate-400" />
              <span>{route.busBayOrPlatform}</span>
            </span>
          </div>

          <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#FF9F0A] group-hover:text-slate-950 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
