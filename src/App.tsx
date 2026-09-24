/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StationTabs } from './components/StationTabs';
import { SearchBar } from './components/SearchBar';
import { RouteCard } from './components/RouteCard';
import { RouteModal } from './components/RouteModal';
import { EmergencyModal } from './components/EmergencyModal';
import { FareComparatorModal } from './components/FareComparatorModal';
import { SplashScreen } from './components/SplashScreen';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  TRANSIT_ROUTES,
  TRANSIT_STATIONS,
  TransitRoute,
  TransitStation,
} from './data/transitData';
import {
  getSriLankaDate,
  getRouteDepartureStatus,
  formatMinutesTo12Hour,
} from './utils/timeUtils';
import {
  Bus,
  Train,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Sparkles,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  Compass,
  Zap,
} from 'lucide-react';

export default function App() {
  // Navigation & filter state
  const [activeStationId, setActiveStationId] = useState<string>('makumbura');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModeFilter, setActiveModeFilter] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'fare-low' | 'duration-fast'>('default');
  const [languageMode, setLanguageMode] = useState<'all' | 'en' | 'si' | 'ta'>('all');
  const [useSriLankaTime, setUseSriLankaTime] = useState<boolean>(true);

  // Saved routes / bookmarks
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('lanka_transit_saved_routes');
      return stored ? JSON.parse(stored) : ['mmc-ex1-1', 'train-udarata-menike'];
    } catch {
      return ['mmc-ex1-1', 'train-udarata-menike'];
    }
  });

  // Modal states
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Live timer tick
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist bookmarks
  const handleToggleSave = (routeId: string) => {
    setSavedRouteIds((prev) => {
      const next = prev.includes(routeId)
        ? prev.filter((id) => id !== routeId)
        : [...prev, routeId];
      try {
        localStorage.setItem('lanka_transit_saved_routes', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save route', err);
      }
      return next;
    });
  };

  // Calculated current time string & minutes
  const activeDate = useSriLankaTime ? getSriLankaDate(now) : now;
  const currentMinutes = activeDate.getHours() * 60 + activeDate.getMinutes();
  const isWeekend = activeDate.getDay() === 0 || activeDate.getDay() === 6;

  const formattedCurrentTime = useMemo(() => {
    return activeDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [activeDate]);

  // Route counts per station
  const stationRouteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TRANSIT_STATIONS.forEach((st) => {
      counts[st.id] = TRANSIT_ROUTES.filter((r) => r.stationId === st.id).length;
    });
    return counts;
  }, []);

  // Filtered & sorted routes
  const filteredRoutes = useMemo(() => {
    let list = [...TRANSIT_ROUTES];

    // Station filter (if not 'all-stations' or if a destination isn't searching globally)
    if (activeStationId !== 'all-stations' && !searchQuery.trim() && !selectedDestination) {
      list = list.filter((r) => r.stationId === activeStationId);
    }

    // Mode filter (Expressway, Train, CTB, Private, Saved)
    if (activeModeFilter === 'expressway') {
      list = list.filter((r) => r.isExpressway);
    } else if (activeModeFilter === 'train') {
      list = list.filter((r) => r.transportType === 'train');
    } else if (activeModeFilter === 'ctb') {
      list = list.filter((r) => r.stationId === 'pettah-ctb');
    } else if (activeModeFilter === 'private') {
      list = list.filter((r) => r.stationId === 'pettah-private');
    } else if (activeModeFilter === 'saved') {
      list = list.filter((r) => savedRouteIds.includes(r.id));
    }

    // Popular destination filter
    if (selectedDestination) {
      const target = selectedDestination.toLowerCase();
      list = list.filter(
        (r) =>
          r.destinationEn.toLowerCase().includes(target) ||
          r.viaStops.some((s) => s.toLowerCase().includes(target))
      );
    }

    // Search query match across English, Sinhala, Tamil, Route Number, Train Name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        return (
          r.routeNumber.toLowerCase().includes(q) ||
          r.destinationEn.toLowerCase().includes(q) ||
          r.destinationSi.toLowerCase().includes(q) ||
          r.destinationTa.toLowerCase().includes(q) ||
          r.originEn.toLowerCase().includes(q) ||
          (r.trainName && r.trainName.toLowerCase().includes(q)) ||
          r.serviceType.toLowerCase().includes(q) ||
          r.viaStops.some((s) => s.toLowerCase().includes(q))
        );
      });
    }

    // Sort order
    if (sortBy === 'fare-low') {
      list.sort((a, b) => a.minFare - b.minFare);
    } else if (sortBy === 'duration-fast') {
      const parseDurationMinutes = (dur: string) => {
        let total = 0;
        const hMatch = dur.match(/(\d+)\s*h/);
        const mMatch = dur.match(/(\d+)\s*m/);
        if (hMatch) total += parseInt(hMatch[1], 10) * 60;
        if (mMatch) total += parseInt(mMatch[1], 10);
        return total || 999;
      };
      list.sort((a, b) => parseDurationMinutes(a.estimatedDuration) - parseDurationMinutes(b.estimatedDuration));
    }

    return list;
  }, [
    activeStationId,
    activeModeFilter,
    selectedDestination,
    searchQuery,
    sortBy,
    savedRouteIds,
  ]);

  const activeStation = TRANSIT_STATIONS.find((s) => s.id === activeStationId);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col antialiased selection:bg-[#FF9F0A]/30 selection:text-[#FF9F0A]">
      {/* Top Header & Cultural Hero Banner */}
      <Header
        currentSlTime={formattedCurrentTime}
        savedCount={savedRouteIds.length}
        activeFilter={activeModeFilter}
        onSelectFavorites={() => {
          setActiveModeFilter((prev) => (prev === 'saved' ? 'all' : 'saved'));
        }}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        languageMode={languageMode}
        onSelectLanguage={setLanguageMode}
        useSriLankaTime={useSriLankaTime}
        onToggleTimeMode={() => setUseSriLankaTime((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Standalone PWA In-App Install Prompt Banner */}
        <PWAInstallButton variant="banner" />

        {/* Quick Mode & Mode Comparison Callout */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-[#FF9F0A]/40 flex items-center justify-center text-[#FF9F0A]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                Compare Fares & Transit Travel Times
              </span>
              <span className="text-[11px] text-slate-400">
                Compare Highway AC Express vs Scenic Railway vs CTB Buses to Kandy, Galle, Matara, etc.
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsComparatorOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0A84FF] to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Compare Modes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Station Navigation Tabs */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#FF9F0A] rounded-full" />
              <span>Select Transport Hub</span>
            </h2>

            {/* Quick View All toggle */}
            <button
              onClick={() =>
                setActiveStationId((prev) => (prev === 'all-stations' ? 'makumbura' : 'all-stations'))
              }
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                activeStationId === 'all-stations'
                  ? 'bg-[#FF9F0A] text-slate-950 border-[#FF9F0A] font-semibold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {activeStationId === 'all-stations' ? 'Viewing All 4 Hubs' : 'Show All Stations'}
            </button>
          </div>

          <StationTabs
            activeStationId={activeStationId}
            onSelectStation={(id) => {
              setActiveStationId(id);
              // Clear destination filter if switching station
              setSelectedDestination(null);
            }}
            routeCounts={stationRouteCounts}
            languageMode={languageMode}
          />
        </section>

        {/* Station Overview Banner (when a single station is chosen) */}
        {activeStation && activeStationId !== 'all-stations' && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm">{activeStation.nameEn}</span>
                <span className="text-[#FF9F0A] font-sinhala font-medium text-xs">
                  {activeStation.nameSi}
                </span>
              </div>
              <p className="text-slate-400">{activeStation.tagline} · {activeStation.location}</p>
            </div>

            <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px] self-start sm:self-auto">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <PhoneCall className="w-3 h-3 text-[#0A84FF]" />
                <a href={`tel:${activeStation.hotline.replace(/\s+/g, '')}`} className="hover:underline">
                  {activeStation.hotline}
                </a>
              </span>
            </div>
          </div>
        )}

        {/* Search, Filter & Quick Taps */}
        <section className="space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeModeFilter}
            onFilterChange={setActiveModeFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResults={filteredRoutes.length}
            languageMode={languageMode}
            selectedDestination={selectedDestination}
            onSelectDestination={setSelectedDestination}
          />
        </section>

        {/* Schedule Route Cards Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Showing <strong className="text-slate-200">{filteredRoutes.length}</strong> route{filteredRoutes.length === 1 ? '' : 's'}
              {activeStationId !== 'all-stations' && ` for ${activeStation?.shortName}`}
              {activeModeFilter === 'saved' && ' (Saved Bookmarks)'}
            </span>
            <span className="text-[11px] text-slate-400">
              Tap any card for stop timeline & ticket info
            </span>
          </div>

          {filteredRoutes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <Compass className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">No matching transit routes found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for a city like Kandy, Galle, or Jaffna, or clear your active filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveModeFilter('all');
                  setSelectedDestination(null);
                  setActiveStationId('makumbura');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredRoutes.map((route) => {
                const status = getRouteDepartureStatus(route, currentMinutes, isWeekend);
                const isSaved = savedRouteIds.includes(route.id);

                return (
                  <RouteCard
                    key={route.id}
                    route={route}
                    status={status}
                    isSaved={isSaved}
                    onToggleSave={handleToggleSave}
                    onOpenDetails={setSelectedRoute}
                    languageMode={languageMode}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Travel Information & Tips Section */}
        <section className="mt-10 p-5 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-[#FF9F0A]" />
            <span>Sri Lanka Transit Travel Guidelines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1">
              <span className="font-semibold text-slate-200 block">Expressway Buses</span>
              <p>
                Makumbura MMC features automated electronic ticketing. Please arrive 15 minutes before scheduled departure. Air conditioning is standard.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1">
              <span className="font-semibold text-slate-200 block">Railway Observations</span>
              <p>
                Colombo Fort Railway Station 1st Class observation car and AC Intercity tickets (e.g. Udarata Menike, Uttara Devi) are best reserved in advance via 1971.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1">
              <span className="font-semibold text-slate-200 block">Pettah Central Hubs</span>
              <p>
                Private buses depart from Bastian Mawatha Stand; Government red CTB buses depart from Central Bus Stand Bodhiraja Mawatha, 200m away.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#080b10] py-6 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="font-semibold text-slate-300">Lanka Transit (ලංකා ට්රාන්සිට්)</span>
            <span>·</span>
            <span>Makumbura MMC</span>
            <span>·</span>
            <span>Pettah Private & CTB</span>
            <span>·</span>
            <span>Colombo Fort Railway</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Data sourced from official NTC, SLTB, and Sri Lanka Railways schedules. Always verify with station masters on public holidays.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowSplash(true)}
              className="text-[11px] text-slate-400 hover:text-[#FF9F0A] underline underline-offset-4 transition-colors"
            >
              Replay Scenic Rail Splash Screen
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Full-Screen Loading Splash Screen with Sri Lanka Scenic Rail Hero */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Interactive Modals */}
      <RouteModal
        route={selectedRoute}
        onClose={() => setSelectedRoute(null)}
        status={
          selectedRoute
            ? getRouteDepartureStatus(selectedRoute, currentMinutes, isWeekend)
            : null
        }
        isSaved={selectedRoute ? savedRouteIds.includes(selectedRoute.id) : false}
        onToggleSave={handleToggleSave}
        languageMode={languageMode}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <FareComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        onSelectRoute={(route) => {
          setSelectedRoute(route);
        }}
      />
    </div>
  );
}
