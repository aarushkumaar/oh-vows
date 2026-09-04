import React from 'react';
import { motion } from 'framer-motion';
import { FamilySectionConfig } from '../data/types';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface FamilySectionProps {
  family: FamilySectionConfig;
}

export const FamilySection: React.FC<FamilySectionProps> = ({ family }) => {
  return (
    <section
      className="family-section"
      style={{
        width: '100%',
        backgroundColor: '#5A0A0D',
        color: '#FAF7F0',
        padding: '36px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
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
          backgroundImage: 'url(/assets/backgrounds/overlay-floral-red.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />

      {/* Header: OUR PEOPLE / हमारे लोग */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: '20px', zIndex: 2 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-devanagari)',
            fontSize: '1.65rem',
            color: '#FAF7F0',
            display: 'block',
            letterSpacing: '0.04em',
          }}
        >
          {family.titleHindi || 'हमारे लोग'}
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#E0983A',
            margin: '2px 0 4px',
            fontWeight: 400,
          }}
        >
          {family.titleEnglish || 'OUR PEOPLE'}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: '#E8C5C8',
          }}
        >
          {family.subtitle || 'the people who made us'}
        </p>
      </motion.div>

      {/* Archival Photograph Frame matching Figma */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          width: '100%',
          maxWidth: '340px',
          backgroundColor: '#F7F2E7',
          padding: '10px 10px 18px',
          borderRadius: '2px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
          position: 'relative',
          zIndex: 2,
          margin: '0 auto 16px',
        }}
      >
        {/* Photo with subtle film texture */}
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '1px',
            border: '1px solid rgba(123, 17, 19, 0.15)',
          }}
        >
          <img
            src={family.image}
            alt="Family Archival Portrait"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '260px',
              objectFit: 'cover',
              display: 'block',
              filter: 'sepia(0.08) contrast(1.04) brightness(0.98)',
            }}
          />
        </div>

        {/* Small Caption below photo */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            color: '#5A0A0D',
            marginTop: '12px',
            letterSpacing: '0.02em',
          }}
        >
          {family.caption || '“Rooted in memories, held together with quiet love.”'}
        </p>
      </motion.div>

      {/* Members / Blessings Microcopy */}
      {family.membersNote && (
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.82rem',
            color: '#D8A7AB',
            letterSpacing: '0.04em',
            zIndex: 2,
            marginBottom: '16px',
          }}
        >
          {family.membersNote}
        </p>
      )}

      {/* Perforated Transition */}
      <PerforatedDivider theme="red" variant="punch-row" style={{ marginTop: '12px' }} />
    </section>
  );
};
