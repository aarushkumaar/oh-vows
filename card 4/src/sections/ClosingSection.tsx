import React from 'react';
import { motion } from 'framer-motion';
import { ClosingConfig } from '../data/types';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface ClosingSectionProps {
  closing: ClosingConfig;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ closing }) => {
  return (
    <footer
      className="closing-section"
      style={{
        width: '100%',
        backgroundColor: '#F7F2E7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '36px 20px 48px',
        position: 'relative',
        overflow: 'hidden',
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
          opacity: 0.16,
          pointerEvents: 'none',
        }}
      />

      {/* Candid Couple Photograph */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: '320px',
          backgroundColor: '#FAF7F0',
          padding: '10px 10px 16px',
          borderRadius: '2px',
          boxShadow: '0 8px 24px rgba(45, 15, 12, 0.1)',
          border: '1px solid #DFD2C2',
          marginBottom: '28px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <img
          src={closing.image}
          alt="Couple Closing Portrait"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '260px',
            objectFit: 'cover',
            borderRadius: '1px',
            display: 'block',
            filter: 'contrast(1.02)',
          }}
        />
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.8rem',
            fontStyle: 'italic',
            color: '#7B1113',
            marginTop: '10px',
          }}
        >
          {closing.subtitle || 'With love & warm anticipation,'}
        </span>
      </motion.div>

      {/* Closing Typographic Blessing matching Figma */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: '24px', zIndex: 2 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-devanagari)',
            fontSize: '2.2rem',
            color: '#7B1113',
            display: 'block',
            lineHeight: 1.1,
          }}
        >
          {closing.titleHindi || 'मिलते हैं वहाँ'}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#221411',
            margin: '4px 0 0',
            fontWeight: 400,
          }}
        >
          {closing.titleEnglish || 'SEE YOU THERE'}
        </h3>
      </motion.div>

      {/* Decorative Perforated Mini Divider */}
      <div style={{ width: '160px', margin: '8px 0 24px', zIndex: 2 }}>
        <PerforatedDivider theme="ivory" variant="punch-row" />
      </div>

      {/* Signature Brand Mark: GUL · गुल */}
      <div style={{ zIndex: 2, marginBottom: '16px' }}>
        <span
          style={{
            fontFamily: 'var(--font-devanagari)',
            fontSize: '1.75rem',
            color: '#7B1113',
            letterSpacing: '0.08em',
            display: 'block',
          }}
        >
          {closing.cardNameHindi || 'गुल'}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#5D4A45',
            display: 'block',
            marginTop: '2px',
          }}
        >
          {closing.cardName || 'GUL'}
        </span>
      </div>

      {/* OH. that's creative branding */}
      <div
        style={{
          borderTop: '1px solid rgba(123, 17, 19, 0.15)',
          paddingTop: '16px',
          width: '80%',
          maxWidth: '240px',
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#8E7A75',
          }}
        >
          OH.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.7rem',
            fontStyle: 'italic',
            color: '#A89993',
            marginTop: '2px',
          }}
        >
          {closing.creditText || "that's creative."}
        </p>
      </div>
    </footer>
  );
};
