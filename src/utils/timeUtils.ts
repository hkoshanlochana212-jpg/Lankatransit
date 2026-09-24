import { TransitRoute } from '../data/transitData';

export interface DepartureStatus {
  state: 'boarding-soon' | 'upcoming' | 'frequency-active' | 'ended-for-today' | 'not-started-yet' | 'not-operating-today';
  label: string;
  subLabel?: string;
  nextDepartureTimeFormatted?: string;
  minutesUntilNext?: number;
}

// Convert "05:00 AM" or "17:30" to minutes from midnight
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const clean = timeStr.trim().toUpperCase();

  // Check 12-hour format e.g. "05:00 AM"
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const mins = parseInt(match12[2], 10);
    const period = match12[3];
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
  }

  // Check 24-hour format e.g. "07:00", "13:30"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const mins = parseInt(match24[2], 10);
    return hours * 60 + mins;
  }

  return null;
}

export function formatMinutesTo12Hour(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440;
  let hours = Math.floor(norm / 60);
  const mins = norm % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours}:${minsStr} ${period}`;
}

// Get Sri Lanka time (UTC + 5:30)
export function getSriLankaDate(referenceDate: Date = new Date()): Date {
  const utc = referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000;
  const slOffset = 5.5 * 3600000; // 5 hours 30 minutes
  return new Date(utc + slOffset);
}

export function getRouteDepartureStatus(
  route: TransitRoute,
  currentTimeMinutes: number,
  isWeekend: boolean
): DepartureStatus {
  // Check operating days
  if (route.operatingDays === 'Mon-Fri' && isWeekend) {
    return {
      state: 'not-operating-today',
      label: 'Weekday Service Only',
      subLabel: 'Does not operate on Saturday or Sunday'
    };
  }

  // 1. If specific departure list exists (e.g. fixed train schedules or EX 1-22)
  if (route.specificDepartures && route.specificDepartures.length > 0) {
    const departureMinutesList = route.specificDepartures
      .map(t => parseTimeToMinutes(t))
      .filter((m): m is number => m !== null)
      .sort((a, b) => a - b);

    // Find the next upcoming departure
    for (const depMins of departureMinutesList) {
      const diff = depMins - currentTimeMinutes;
      if (diff >= 0) {
        if (diff <= 10) {
          return {
            state: 'boarding-soon',
            label: `Departs in ${diff === 0 ? 'now' : `${diff}m`}`,
            subLabel: `Boarding at ${formatMinutesTo12Hour(depMins)}`,
            nextDepartureTimeFormatted: formatMinutesTo12Hour(depMins),
            minutesUntilNext: diff
          };
        }
        if (diff < 60) {
          return {
            state: 'upcoming',
            label: `In ${diff} mins`,
            subLabel: `Next: ${formatMinutesTo12Hour(depMins)}`,
            nextDepartureTimeFormatted: formatMinutesTo12Hour(depMins),
            minutesUntilNext: diff
          };
        }
        const hours = Math.floor(diff / 60);
        const remMins = diff % 60;
        return {
          state: 'upcoming',
          label: `In ${hours}h ${remMins > 0 ? `${remMins}m` : ''}`.trim(),
          subLabel: `Next: ${formatMinutesTo12Hour(depMins)}`,
          nextDepartureTimeFormatted: formatMinutesTo12Hour(depMins),
          minutesUntilNext: diff
        };
      }
    }

    // If all departures have passed for today
    const firstTomorrow = departureMinutesList[0];
    return {
      state: 'ended-for-today',
      label: 'Departures Finished Today',
      subLabel: `First tomorrow: ${formatMinutesTo12Hour(firstTomorrow)}`
    };
  }

  // 2. Continuous interval schedule between First and Last departure
  if (route.firstDeparture && route.lastDeparture) {
    const firstMins = parseTimeToMinutes(route.firstDeparture);
    const lastMins = parseTimeToMinutes(route.lastDeparture);

    if (firstMins !== null && lastMins !== null) {
      if (currentTimeMinutes < firstMins) {
        const diff = firstMins - currentTimeMinutes;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return {
          state: 'not-started-yet',
          label: `Starts in ${hours > 0 ? `${hours}h ` : ''}${mins}m`,
          subLabel: `First departure: ${route.firstDeparture}`
        };
      }

      if (currentTimeMinutes > lastMins) {
        return {
          state: 'ended-for-today',
          label: 'Service Ended for Today',
          subLabel: `Resumes at ${route.firstDeparture} tomorrow`
        };
      }

      // Currently active interval
      return {
        state: 'frequency-active',
        label: 'Active High Frequency',
        subLabel: `${route.frequency || 'Regular service'} until ${route.lastDeparture}`
      };
    }
  }

  return {
    state: 'upcoming',
    label: route.frequency || 'Operates Regularly',
    subLabel: route.firstDeparture ? `Starts ${route.firstDeparture}` : 'Check board'
  };
}
