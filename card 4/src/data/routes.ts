import { RouteConfig } from './types';

export const routeConfigs: Record<string, RouteConfig> = {
  'default': {
    slug: '',
    label: 'Full Invitation (All Events)',
    visibleEventIds: ['engagement', 'mehendi', 'wedding'],
  },
  'all': {
    slug: 'all',
    label: 'All Events (Complete Experience)',
    visibleEventIds: ['engagement', 'mehendi', 'wedding'],
  },
  'bride-2': {
    slug: 'bride/2',
    label: 'Bride Side — Intimate (Engagement & Wedding)',
    visibleEventIds: ['engagement', 'wedding'],
    guestGroup: 'Bride Family & Close Friends',
  },
  'bride-3': {
    slug: 'bride/3',
    label: 'Bride Side — Full (Engagement, Mehendi & Wedding)',
    visibleEventIds: ['engagement', 'mehendi', 'wedding'],
    guestGroup: 'Bride Side Extended',
  },
  'groom-T': {
    slug: 'groom/T',
    label: 'Groom Side — Complete (Engagement, Mehendi, Wedding)',
    visibleEventIds: ['engagement', 'mehendi', 'wedding'],
    guestGroup: 'Groom Family & Close Circle',
  },
  'groom-R': {
    slug: 'groom/R',
    label: 'Groom Side — Reception / Wedding',
    visibleEventIds: ['wedding'],
    guestGroup: 'Wedding Reception Guests',
  },
  'wedding-only': {
    slug: 'wedding',
    label: 'Main Vivah Wedding Ceremony Only',
    visibleEventIds: ['wedding'],
  },
  'mehendi-only': {
    slug: 'mehendi',
    label: 'Mehendi & Sangeet Celebration Only',
    visibleEventIds: ['mehendi'],
  },
};

/**
 * Resolve visible event IDs based on current path
 */
export function getRouteConfigForPath(pathname: string): RouteConfig {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (!cleanPath || cleanPath === '' || cleanPath === 'invite') {
    return routeConfigs['default'];
  }

  for (const config of Object.values(routeConfigs)) {
    if (config.slug && cleanPath === config.slug.toLowerCase()) {
      return config;
    }
  }

  // Handle path patterns like bride/2 or groom/T
  if (cleanPath.startsWith('invite/')) {
    const subPath = cleanPath.replace(/^invite\//, '');
    for (const config of Object.values(routeConfigs)) {
      if (config.slug && subPath === config.slug.toLowerCase()) {
        return config;
      }
    }
  }

  // Fallback: return default with all events
  return routeConfigs['default'];
}
