/**
 * Invitation Configuration â€” Single Source of Truth
 *
 * Defines all 6 invitation variants. Loaded synchronously before all other
 * scripts so InvitationConfig is available when deferred modules execute.
 *
 * To add a new variant: add an entry to INVITATIONS and create a matching
 * route folder (e.g., thehvstory/bride/four/index.html).
 */
(() => {
  'use strict';

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     DOMAIN â€” update to your actual Vercel / custom domain
     before going live. This affects OG image URLs.
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const SITE_DOMAIN  = 'https://thehvstory.in';
  const OG_IMAGE_URL = `${SITE_DOMAIN}/assets/images/gallery/cover-image.jpg`;

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     INVITATION VARIANTS
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const INVITATIONS = {

    // â”€â”€ BRIDE SIDE (Chhabra Family) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'bride-one': {
      familySide:  'bride',
      familyLabel: 'CHHABRA FAMILY',
      route:       '/hvstory/bride/one',
      events:      ['wedding'],
      rsvp: {
        title:          'RSVP â€” Chhabra Family',
        names:          'Deepa Chhabra &amp;<br>Kamal Chhabra',
        specialMention: 'Special â€” Mehar Chhabra',
      },
      og: {
        title:       'Vartika & Hardik Wedding',
        description: 'A celebration of love, family & forever. #theHVstory',
        image:       OG_IMAGE_URL,
      },
    },

    'bride-two': {
      familySide:  'bride',
      familyLabel: 'CHHABRA FAMILY',
      route:       '/hvstory/bride/two',
      events:      ['engagement-cocktail', 'wedding'],
      rsvp: {
        title:          'RSVP â€” Chhabra Family',
        names:          'Deepa Chhabra &amp;<br>Kamal Chhabra',
        specialMention: 'Special â€” Mehar Chhabra',
      },
      og: {
        title:       'Vartika & Hardik Wedding',
        description: 'A celebration of love, family & forever. #theHVstory',
        image:       OG_IMAGE_URL,
      },
    },

    'bride-three': {
      familySide:  'bride',
      familyLabel: 'CHHABRA FAMILY',
      route:       '/hvstory/bride/three',
      events:      ['engagement-cocktail', 'haldi-carnival', 'wedding'],
      rsvp: {
        title:          'RSVP â€” Chhabra Family',
        names:          'Deepa Chhabra &amp;<br>Kamal Chhabra',
        specialMention: 'Special â€” Mehar Chhabra',
      },
      og: {
        title:       'Vartika & Hardik Wedding',
        description: 'A celebration of love, family & forever. #theHVstory',
        image:       OG_IMAGE_URL,
      },
    },

    // â”€â”€ GROOM SIDE (Chawla Family) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    'groom-one': {
      familySide:  'groom',
      familyLabel: 'CHAWLA FAMILY',
      route:       '/hvstory/groom/one',
      events:      ['wedding'],
      rsvp: {
        title:          'RSVP â€” Chawla Family',
        names:          'Sonia Chawla &amp;<br>Vijay Chawla',
        specialMention: 'Special Mention â€” Tarang Chawla',
      },
      og: {
        title:       'Vartika & Hardik Wedding',
        description: 'A celebration of love, family & forever. #theHVstory',
        image:       OG_IMAGE_URL,
      },
    },

    'groom-two': {
      familySide:  'groom',
      familyLabel: 'CHAWLA FAMILY',
      route:       '/hvstory/groom/two',
      events:      ['engagement-cocktail', 'wedding'],
      rsvp: {
        title:          'RSVP â€” Chawla Family',
        names:          'Sonia Chawla &amp;<br>Vijay Chawla',
        specialMention: 'Special Mention â€” Tarang Chawla',
      },
      og: {
        title:       'Vartika & Hardik Wedding',
        description: 'A celebration of love, family & forever. #theHVstory',
        image:       OG_IMAGE_URL,
      },
    },

    'groom-three': {
      familySide:  'groom',
      familyLabel: 'CHAWLA FAMILY',
      route:       '/hvstory/groom/three',
      events:      ['engagement-cocktail', 'haldi-carnival', 'wedding'],
      rsvp: {
        title:          'RSVP â€” Chawla Family',
        names:          'Sonia Chawla &amp;<br>Vijay Chawla',
        specialMention: 'Special Mention â€” Tarang Chawla',
      },
      og: {
        title:       'Vartika & Hardik Wedding',
        description: 'A celebration of love, family & forever. #theHVstory',
        image:       OG_IMAGE_URL,
      },
    },

  };

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     ROUTE DETECTION
     Priority order:
       1. data-invitation attribute on <html>  (set by route entry points)
       2. URL path pattern matching            (fallback for direct links)
       3. Default to bride-three              (all events, for root index.html)
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function detectInvitationKey() {
    const attr = document.documentElement.getAttribute('data-invitation');
    if (attr && INVITATIONS[attr]) return attr;

    const path = window.location.pathname.toLowerCase();
    if (/\/bride\/one\b/.test(path))   return 'bride-one';
    if (/\/bride\/two\b/.test(path))   return 'bride-two';
    if (/\/bride\/three\b/.test(path)) return 'bride-three';
    if (/\/groom\/one\b/.test(path))   return 'groom-one';
    if (/\/groom\/two\b/.test(path))   return 'groom-two';
    if (/\/groom\/three\b/.test(path)) return 'groom-three';

    return 'bride-three'; // default: all events, bride side
  }

  const currentKey    = detectInvitationKey();
  const currentConfig = INVITATIONS[currentKey];

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     PUBLIC API
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  window.InvitationConfig = {
    key:                 currentKey,
    config:              currentConfig,
    SITE_DOMAIN:         SITE_DOMAIN,

    getCurrentInvitation: () => currentConfig,
    getFilteredEventIds:  () => currentConfig.events,
    getRSVPConfig:        () => currentConfig.rsvp,
    getFamilySide:        () => currentConfig.familySide,
    getFamilyLabel:       () => currentConfig.familyLabel,
    getOGConfig:          () => currentConfig.og,

    /* Future-proof helper: easy to add more variants later */
    getAllInvitations: () => INVITATIONS,
  };
})();
