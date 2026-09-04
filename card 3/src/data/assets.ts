export interface AssetManifest {
  [key: string]: {
    path: string
    description: string
    category: string
    type: 'image' | 'typography' | 'background' | 'decoration'
  }
}

export const assetManifest: AssetManifest = {
  // Hands for opening animation
  hand_bride: {
    path: '/assets/hand left.png',
    description: 'Bride hand for opening animation',
    category: 'animation',
    type: 'image',
  },
  hand_groom: {
    path: '/assets/hand right.png',
    description: 'Groom hand for opening animation',
    category: 'animation',
    type: 'image',
  },

  // Event stamps
  engagement_stamp: {
    path: '/assets/engagement_stamp.png',
    description: 'Engagement event stamp front',
    category: 'events',
    type: 'image',
  },
  mehendi_stamp: {
    path: '/assets/mehandi_stamp.png',
    description: 'Mehendi event stamp front',
    category: 'events',
    type: 'image',
  },
  wedding_stamp: {
    path: '/assets/wedding_stamp.png',
    description: 'Wedding event stamp front',
    category: 'events',
    type: 'image',
  },

  // Typography assets
  vivah_typography: {
    path: '/assets/vivah typography.png',
    description: 'विवाह typography artwork',
    category: 'typography',
    type: 'typography',
  },
  karyakram_typography: {
    path: '/assets/the karyakram typography.png',
    description: 'कार्यक्रम typography artwork',
    category: 'typography',
    type: 'typography',
  },
  aapka_intazaar_typography: {
    path: '/assets/aapka intazaar rahega.png',
    description: 'आपका इंतज़ार रहेगा typography',
    category: 'typography',
    type: 'typography',
  },

  // Background overlays
  bg_overlay_red: {
    path: '/assets/bg_overlay_red.png',
    description: 'Red floral background overlay',
    category: 'backgrounds',
    type: 'background',
  },
  bg_overlay_yellow: {
    path: '/assets/bg_overlay_yellow.png',
    description: 'Yellow floral background overlay',
    category: 'backgrounds',
    type: 'background',
  },

  // Stamp backgrounds
  stamp_bg_red: {
    path: '/assets/stamp_like_bg_red.png',
    description: 'Red stamp-like background',
    category: 'backgrounds',
    type: 'background',
  },
  stamp_bg_green: {
    path: '/assets/stamp_like_bg_green.png',
    description: 'Green stamp-like background',
    category: 'backgrounds',
    type: 'background',
  },
  stamp_bg_green_alt: {
    path: '/assets/stamp_like_bg_green-1.png',
    description: 'Green stamp-like background (alternate)',
    category: 'backgrounds',
    type: 'background',
  },

  // RSVP
  rsvp_image: {
    path: '/assets/rsvp.png',
    description: 'RSVP card artwork',
    category: 'rsvp',
    type: 'image',
  },
}

export const getAsset = (key: string): string | null => {
  return assetManifest[key]?.path || null
}

export const getAssetsByCategory = (category: string): string[] => {
  return Object.entries(assetManifest)
    .filter(([_, asset]) => asset.category === category)
    .map(([_, asset]) => asset.path)
}
