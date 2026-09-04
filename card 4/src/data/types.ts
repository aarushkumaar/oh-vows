export interface CoupleConfig {
  personA: string;
  personB: string;
  personAHindi?: string;
  personBHindi?: string;
  initials: string;
  hashtag?: string;
  storyLine: string;
  weddingDate: string;
  city: string;
}

export interface HeroConfig {
  image: string;
  mobileImage?: string;
  desktopImage?: string;
  title: string;
  subtitle: string;
  description: string;
  devanagariTitle: string;
}

export interface EventItem {
  id: string;
  name: string;
  localName: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  address?: string;
  description: string;
  dressCode: string;
  dressColors: string[];
  mapUrl: string;
  calendarUrl: string;
  illustration: string;
  frontAsset?: string;
  backAsset?: string;
  themeColor?: string;
  accentColor?: string;
  stampBg?: string;
  enabled?: boolean;
}

export interface StorySectionItem {
  id: string;
  tagline: string;
  headingHindi: string;
  headingEnglish: string;
  text: string;
  quote?: string;
  backgroundTheme: 'ivory' | 'red' | 'terracotta' | 'pattern';
}

export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  alt: string;
  tag?: string;
  aspectRatio?: string;
}

export interface FamilySectionConfig {
  titleEnglish: string;
  titleHindi: string;
  subtitle: string;
  caption: string;
  image: string;
  membersNote?: string;
}

export interface RSVPField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface RSVPConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  familyName: string;
  confirmationStamp: string;
  confirmationMessage: string;
  fields: RSVPField[];
}

export interface LocationConfig {
  venue: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmarkNote: string;
  mapIllustration?: string;
}

export interface ClosingConfig {
  titleEnglish: string;
  titleHindi: string;
  subtitle: string;
  image: string;
  cardName: string;
  cardNameHindi: string;
  creditText: string;
}

export interface ThemeConfig {
  paper: string;
  paperWarm: string;
  red: string;
  redDeep: string;
  saffron: string;
  gold: string;
  ink: string;
}

export interface WeddingCardConfig {
  cardId: string;
  cardName: string;
  cardNameHindi: string;
  couple: CoupleConfig;
  hero: HeroConfig;
  story: StorySectionItem[];
  events: EventItem[];
  family: FamilySectionConfig;
  rsvp: RSVPConfig;
  location: LocationConfig;
  closing: ClosingConfig;
  theme: ThemeConfig;
}

export interface RouteConfig {
  slug: string;
  label: string;
  visibleEventIds: string[];
  guestGroup?: string;
}
