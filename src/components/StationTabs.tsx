import React from 'react';
import { Bus, Train, Compass, Zap } from 'lucide-react';
import { TRANSIT_STATIONS, TransitStation } from '../data/transitData';

interface StationTabsProps {
  activeStationId: string;
  onSelectStation: (id: string) => void;
  routeCounts: Record<string, number>;
  languageMode: 'all' | 'en' | 'si' | 'ta';
}

export const StationTabs: React.FC<StationTabsProps> = ({
  activeStationId,
  onSelectStation,
  routeCounts,
  languageMode,
}) => {
  const getStationIcon = (type: TransitStation['type']) => {
    switch (type) {
      case 'multimodal':
        return <Zap className="w-4 h-4 text-[#FF9F0A]" />;
      case 'train':
        return <Train className="w-4 h-4 text-[#30D158]" />;
      case 'bus':
      default:
        return <Bus className="w-4 h-4 text-[#0A84FF]" />;
    }
  };

  const getStationTitle = (station: TransitStation) => {
    if (languageMode === 'si') return station.nameSi;
    if (languageMode === 'ta') return station.nameTa;
    if (languageMode === 'en') return station.nameEn;
    return (
      <span className="flex flex-col text-left">
        <span className="font-semibold text-slate-100">{station.shortName}</span>
        <span className="text-[11px] font-normal text-slate-400 font-sinhala leading-tight">
          {station.nameSi}
        </span>
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Station navigation horizontal track */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {TRANSIT_STATIONS.map((station) => {
          const isActive = activeStationId === station.id;
          const count = routeCounts[station.id] || 0;

          return (
            <button
              key={station.id}
              onClick={() => onSelectStation(station.id)}
              className={`group relative p-3 sm:p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[92px] ${
                isActive
                  ? 'bg-slate-800/90 border-[#FF9F0A] shadow-lg shadow-amber-500/10 ring-1 ring-[#FF9F0A]/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Top row with icon & count */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`p-1.5 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-slate-950 border border-slate-700' : 'bg-slate-800/80'
                  }`}
                >
                  {getStationIcon(station.type)}
                </div>

                <span
                  className={`text-[10px] font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count} Routes
                </span>
              </div>

              {/* Station name */}
              <div className="w-full mt-auto">
                {typeof getStationTitle(station) === 'string' ? (
                  <div
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isActive ? 'text-white' : 'text-slate-200'
                    }`}
                  >
                    {getStationTitle(station)}
                  </div>
                ) : (
                  getStationTitle(station)
                )}
                <div className="text-[10px] text-slate-400 mt-0.5 truncate flex items-center gap-1">
                  <Compass className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span>{station.bayCount}</span>
                </div>
              </div>

              {/* Active bottom line indicator */}
              {isActive && (
                <div className="absolute -bottom-px left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#FF9F0A] to-transparent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
