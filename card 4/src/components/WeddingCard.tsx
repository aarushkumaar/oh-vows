import React, { useState, useEffect } from 'react';
import { WeddingCardConfig } from '../data/types';
import { getRouteConfigForPath } from '../data/routes';
import { LoadingExperience } from './LoadingExperience';
import { Hero } from '../sections/Hero';
import { StorySection } from '../sections/StorySection';
import { ProgramSection } from '../sections/ProgramSection';
import { FamilySection } from '../sections/FamilySection';
import { RSVPCard } from '../sections/RSVPCard';
import { LocationSection } from '../sections/LocationSection';
import { ClosingSection } from '../sections/ClosingSection';
import { AdminPanel } from '../admin/AdminPanel';

interface WeddingCardProps {
  initialConfig: WeddingCardConfig;
}

export const WeddingCard: React.FC<WeddingCardProps> = ({ initialConfig }) => {
  const [config, setConfig] = useState<WeddingCardConfig>(initialConfig);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Check session storage for returning visitors
  useEffect(() => {
    const seen = sessionStorage.getItem('gul_intro_seen');
    if (seen === 'true') {
      setHasSeenIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    sessionStorage.setItem('gul_intro_seen', 'true');
  };

  // Replay intro function
  const handleReplayIntro = () => {
    setHasSeenIntro(false);
  };

  // Resolve active route configuration
  const activeRouteConfig = getRouteConfigForPath(currentPath);

  // Handler for testing route variants via admin or switcher
  const handleSelectRoute = (slug: string) => {
    const newPath = slug ? `/${slug}` : '/';
    window.history.pushState({}, '', newPath);
    setCurrentPath(newPath);
  };

  return (
    <div className="wedding-card-engine" style={{ width: '100%', position: 'relative' }}>
      {/* 1. CINEMATIC OPENING EXPERIENCE */}
      {!hasSeenIntro && (
        <LoadingExperience
          onComplete={handleIntroComplete}
          coupleNames={config.hero.title || `${config.couple.personA} & ${config.couple.personB}`}
        />
      )}

      {/* 2. CENTRAL MOBILE-FIRST INVITATION CANVAS */}
      <main className="invitation-canvas" id="invitation-root">
        {/* Floating Quick Action Bar (Discreet & Non-intrusive) */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 100,
            display: 'flex',
            gap: '6px',
          }}
        >
          <button
            onClick={handleReplayIntro}
            title="Replay Rose Opening Sequence"
            style={{
              backgroundColor: 'rgba(247, 242, 231, 0.85)',
              border: '1px solid rgba(123, 17, 19, 0.25)',
              borderRadius: '2px',
              padding: '3px 8px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-serif)',
              color: '#7B1113',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            🌹 Intro
          </button>
          <button
            onClick={() => setShowAdmin(true)}
            title="Open Admin Content & Variant Controls"
            style={{
              backgroundColor: '#7B1113',
              color: '#FAF7F0',
              border: 'none',
              borderRadius: '2px',
              padding: '3px 9px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-serif)',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            ⚙ Admin
          </button>
        </div>

        {/* Route Variant Indicator Pill (if guest-specific route is active) */}
        {activeRouteConfig.slug && (
          <div
            style={{
              backgroundColor: '#FAF2E6',
              borderBottom: '1px solid rgba(123, 17, 19, 0.15)',
              padding: '4px 12px',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: '#7B1113',
              fontFamily: 'var(--font-serif)',
            }}
          >
            ✦ Personalized Invitation for {activeRouteConfig.guestGroup || activeRouteConfig.label}
          </div>
        )}

        {/* HERO SECTION */}
        <Hero hero={config.hero} couple={config.couple} />

        {/* STORY SECTION */}
        <StorySection stories={config.story} />

        {/* PROGRAM SECTION (With 3D Flip Postage Stamps) */}
        <ProgramSection
          events={config.events}
          visibleEventIds={activeRouteConfig.visibleEventIds}
        />

        {/* FAMILY ARCHIVAL SECTION */}
        <FamilySection family={config.family} />

        {/* WEDDING STATIONERY RSVP SECTION */}
        <RSVPCard rsvp={config.rsvp} />

        {/* DESTINATION LOCATION SECTION */}
        <LocationSection location={config.location} />

        {/* CLOSING SECTION & FOOTER */}
        <ClosingSection closing={config.closing} />
      </main>

      {/* 3. ADMIN PANEL MODAL */}
      <AdminPanel
        config={config}
        onUpdateConfig={setConfig}
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        activeRoute={activeRouteConfig.slug}
        onSelectRoute={handleSelectRoute}
      />
    </div>
  );
};
