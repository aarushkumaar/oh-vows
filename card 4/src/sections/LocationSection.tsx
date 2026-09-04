import React from 'react';
import { motion } from 'framer-motion';
import { LocationConfig } from '../data/types';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface LocationSectionProps {
  location: LocationConfig;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ location }) => {
  return (
    <section
      className="location-section"
      style={{
        width: '100%',
        backgroundColor: '#F7F2E7',
        padding: '36px 20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Background Floral Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/backgrounds/overlay-floral-yellow.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: '20px', zIndex: 2 }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#7B1113',
            fontFamily: 'var(--font-serif)',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          — स्थान —
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            color: '#221411',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}
        >
          THE DESTINATION
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: '#68544E',
          }}
        >
          {location.city}
        </p>
      </motion.div>

      {/* Stationery Map Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#FAF7F0',
          border: '1px solid #D8C8B5',
          borderRadius: '2px',
          padding: '20px 18px',
          boxShadow: '0 8px 24px rgba(45, 15, 12, 0.08)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Hand-drawn styled destination graphic / palace motif */}
        <div
          style={{
            width: '100%',
            height: '110px',
            backgroundColor: '#F4EBD9',
            border: '1px dashed #7B1113',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Compass / Postal Seal */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '0.9rem',
              color: '#7B1113',
              opacity: 0.6,
            }}
          >
            🧭 N
          </div>

          <span style={{ fontSize: '2rem', color: '#7B1113', opacity: 0.85 }}>🏰</span>
          <span
            style={{
              fontFamily: 'var(--font-devanagari)',
              fontSize: '1.05rem',
              color: '#7B1113',
              marginTop: '4px',
            }}
          >
            झील पिछोला · उदयपुर
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8E7A75',
            }}
          >
            Lake Pichola Heritage Sanctuary
          </span>
        </div>

        {/* Venue Information */}
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: '#7B1113',
            fontWeight: 400,
            marginBottom: '6px',
          }}
        >
          {location.venue}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            color: '#4A3733',
            lineHeight: 1.4,
            marginBottom: '10px',
          }}
        >
          {location.address}
        </p>

        {/* Guest Arrival / Jetty Note */}
        {location.landmarkNote && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              color: '#7B1113',
              backgroundColor: '#F7F2E7',
              padding: '6px 10px',
              borderRadius: '2px',
              borderLeft: '2px solid #7B1113',
              margin: '10px 0 16px',
              textAlign: 'left',
            }}
          >
            ✦ Note: {location.landmarkNote}
          </p>
        )}

        {/* Open in Maps Button */}
        <a
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#7B1113',
            color: '#FAF7F0',
            textDecoration: 'none',
            padding: '8px 18px',
            borderRadius: '2px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            boxShadow: '0 3px 8px rgba(123, 17, 19, 0.25)',
          }}
        >
          <span>Get Directions</span>
          <span>↗</span>
        </a>
      </motion.div>

      {/* Perforated Transition */}
      <PerforatedDivider theme="ivory" variant="punch-row" style={{ marginTop: '28px' }} />
    </section>
  );
};
