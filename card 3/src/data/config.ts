// Central data model for the wedding invitation
export interface EventStamp {
  id: string
  name: string
  localName: string
  date: string
  time: string
  venue: string
  city: string
  description: string
  dressCode?: string
  dressColors?: string[]
  mapUrl?: string
  calendarUrl?: string
  illustration?: string
  frontAsset?: string
  backAsset?: string
  theme: {
    bg: string
    text: string
    accent: string
  }
}

export interface CoupleInfo {
  personA: string
  personB: string
  initials: string
  photoMobile?: string
  photoDesktop?: string
}

export interface HeroSection {
  image?: string
  imageMobile?: string
  imageDesktop?: string
  title: string
  subtitle: string
  description: string
  localTitle?: string
}

export interface PhotoSection {
  heroPhoto?: string
  couplePhotos: string[]
  memoryPhotos: string[]
  familyPhotos: string[]
}

export interface RSVPConfig {
  enabled: boolean
  title: string
  description: string
  fields: string[]
}

export interface LocationConfig {
  venue: string
  address: string
  city: string
  mapUrl?: string
  coordinates?: { lat: number; lng: number }
  illustration?: string
}

export interface WeddingCardConfig {
  cardName: string
  cardNameHindi: string
  couple: CoupleInfo
  hero: HeroSection
  events: EventStamp[]
  photos: PhotoSection
  rsvp: RSVPConfig
  location: LocationConfig
  closing: {
    title: string
    subtitle: string
    image?: string
  }
  theme: {
    primaryPaper: string
    primaryRed: string
    secondaryRed: string
    accentColor: string
    backgroundColor: string
    textColor: string
  }
}

export interface RouteConfig {
  [route: string]: {
    events: string[]
  }
}

// Default configuration for GUL
export const gulConfig: WeddingCardConfig = {
  cardName: 'GUL',
  cardNameHindi: 'गुल',
  couple: {
    personA: 'Bride Name',
    personB: 'Groom Name',
    initials: 'AB',
  },
  hero: {
    title: 'Two people, one very long story',
    subtitle: 'A celebration of love',
    description: 'Together with our families, we invite you to celebrate our wedding',
    localTitle: 'विवाह',
  },
  events: [
    {
      id: 'engagement',
      name: 'Engagement',
      localName: 'सगाई',
      date: '15 October 2026',
      time: '6:00 PM onwards',
      venue: 'The Taj Palace',
      city: 'New Delhi',
      description: 'Join us as we celebrate our engagement',
      dressCode: 'Semi-formal',
      dressColors: ['Gold', 'Silver', 'Pastels'],
      theme: {
        bg: '#F4A460',
        text: '#2C2C2C',
        accent: '#D4443D',
      },
      frontAsset: 'engagement_stamp.png',
    },
    {
      id: 'mehendi',
      name: 'Mehendi',
      localName: 'मेहंदी',
      date: '20 October 2026',
      time: '5:00 PM onwards',
      venue: 'The Taj Palace',
      city: 'New Delhi',
      description: 'Celebrate with us in a riot of colors and music',
      dressCode: 'Traditional or Colorful',
      dressColors: ['Green', 'Red', 'Yellow', 'Orange'],
      theme: {
        bg: '#90EE90',
        text: '#2C2C2C',
        accent: '#D4443D',
      },
      frontAsset: 'mehandi_stamp.png',
    },
    {
      id: 'wedding',
      name: 'Wedding',
      localName: 'विवाह',
      date: '22 October 2026',
      time: '7:00 PM onwards',
      venue: 'The Taj Palace',
      city: 'New Delhi',
      description: 'Two souls, one promise, forever',
      dressCode: 'Formal or Traditional',
      dressColors: ['Red', 'Maroon', 'Gold'],
      theme: {
        bg: '#D4443D',
        text: '#FAF6F1',
        accent: '#F4A460',
      },
      frontAsset: 'wedding_stamp.png',
    },
  ],
  photos: {
    couplePhotos: [],
    memoryPhotos: [],
    familyPhotos: [],
  },
  rsvp: {
    enabled: true,
    title: 'RSVP',
    description: 'Please let us know if you can join us',
    fields: ['name', 'guests', 'attendance', 'message'],
  },
  location: {
    venue: 'The Taj Palace',
    address: '123 Wedding Lane',
    city: 'New Delhi',
    mapUrl: 'https://maps.google.com',
  },
  closing: {
    title: 'See you there',
    subtitle: 'मिलते हैं वहाँ',
  },
  theme: {
    primaryPaper: '#FAF6F1',
    primaryRed: '#D4443D',
    secondaryRed: '#8B3A36',
    accentColor: '#F4A460',
    backgroundColor: '#F5EFE7',
    textColor: '#2C2C2C',
  },
}

export const routeConfig: RouteConfig = {
  '/bride/2': {
    events: ['engagement', 'wedding'],
  },
  '/groom/T': {
    events: ['engagement', 'mehendi', 'wedding'],
  },
  '/all': {
    events: ['engagement', 'mehendi', 'wedding'],
  },
}
