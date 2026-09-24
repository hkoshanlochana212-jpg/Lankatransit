import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: 'default' | 'fare-low' | 'duration-fast';
  onSortChange: (sort: 'default' | 'fare-low' | 'duration-fast') => void;
  totalResults: number;
  languageMode: 'all' | 'en' | 'si' | 'ta';
  selectedDestination: string | null;
  onSelectDestination: (dest: string | null) => void;
}

const POPULAR_DESTINATIONS = [
  { en: 'Kandy', si: 'මහනුවර', ta: 'கண்டி' },
  { en: 'Galle', si: 'ගාල්ල', ta: 'காலி' },
  { en: 'Matara', si: 'මාතර', ta: 'மாத்தறை' },
  { en: 'Badulla', si: 'බදුල්ල', ta: 'பதுளை' },
  { en: 'Jaffna', si: 'යාපනය', ta: 'யாழ்ப்பாணம்' },
  { en: 'Batticaloa', si: 'මඩකලපුව', ta: 'மட்டக்களப்பு' },
  { en: 'Anuradhapura', si: 'අනුරාධපුරය', ta: 'அனுராதபுரம்' },
  { en: 'Tangalle', si: 'තංගල්ල', ta: 'தங்காலை' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  totalResults,
  languageMode,
  selectedDestination,
  onSelectDestination,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Primary search input with Saffron Gold & Transport Blue accents */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-[#0A84FF]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            languageMode === 'si'
              ? 'මාර්ග අංකය, ගමනාන්තය හෝ දුම්රිය නම සොයන්න (උදා: Kandy, EX 1-1, උඩරට මැණිකේ)...'
              : languageMode === 'ta'
              ? 'பாதை எண், சேருமிடம் அல்லது ரயிலைத் தேடுங்கள்...'
              : 'Search route (e.g., EX 1-1, 04), destination (Kandy, Galle, Jaffna) or train name...'
          }
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#FF9F0A] focus:ring-2 focus:ring-[#FF9F0A]/20 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and sorting control bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Mode filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
          {[
            { id: 'all', label: 'All Modes', si: 'සියල්ල' },
            { id: 'expressway', label: 'Expressway', si: 'අධිවේගී' },
            { id: 'train', label: 'Trains', si: 'දුම්රිය' },
            { id: 'ctb', label: 'SLTB CTB', si: 'ලංගම' },
            { id: 'private', label: 'Private Buses', si: 'පෞද්ගලික' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onFilterChange(mode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === mode.id
                  ? 'bg-gradient-to-r from-[#FF9F0A] to-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {languageMode === 'si' ? mode.si : mode.label}
            </button>
          ))}
        </div>

        {/* Sort & result count */}
        <div className="flex items-center gap-2 text-xs ml-auto">
          <div className="hidden sm:flex items-center text-slate-400 tabular-nums">
            <span>{totalResults} {totalResults === 1 ? 'service' : 'services'} available</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-lg p-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 border-none outline-none pr-2 py-0.5 cursor-pointer"
            >
              <option value="default" className="bg-slate-900 text-slate-200">
                Default Order
              </option>
              <option value="fare-low" className="bg-slate-900 text-slate-200">
                Lowest Fare (Rs.)
              </option>
              <option value="duration-fast" className="bg-slate-900 text-slate-200">
                Fastest Duration
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Popular Destination Quick Taps */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3 h-3 text-[#FF9F0A]" />
          <span>Quick:</span>
        </span>
        {POPULAR_DESTINATIONS.map((dest) => {
          const isSelected = selectedDestination === dest.en;
          return (
            <button
              key={dest.en}
              onClick={() => onSelectDestination(isSelected ? null : dest.en)}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#0A84FF] text-white font-medium shadow-sm'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
              }`}
            >
              {dest.en}
              {languageMode === 'si' && <span className="font-sinhala ml-1 text-[11px] opacity-80">({dest.si})</span>}
            </button>
          );
        })}
        {selectedDestination && (
          <button
            onClick={() => onSelectDestination(null)}
            className="text-[11px] text-[#FF9F0A] hover:underline whitespace-nowrap px-1"
          >
            Clear dest
          </button>
        )}
      </div>
    </div>
  );
};
