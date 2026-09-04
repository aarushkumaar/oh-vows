import React from 'react';
import { motion } from 'framer-motion';
import { EventItem } from '../data/types';
import { EventStamp } from '../components/EventStamp';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface ProgramSectionProps {
  events: EventItem[];
  visibleEventIds?: string[];
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({
  events,
  visibleEventIds,
}) => {
  // Filter events based on active route config or show all enabled
  const displayedEvents = events.filter((evt) => {
    const isEnabled = evt.enabled !== false;
    if (!visibleEventIds || visibleEventIds.length === 0) return isEnabled;
    return isEnabled && visibleEventIds.includes(evt.id);
  });

  return (
    <section
      className="program-section"
      style={{
        width: '100%',
        backgroundColor: '#F7F2E7',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '36px',
        paddingBottom: '20px',
      }}
    >
      {/* Delicate Floral Watermark Texture matching Figma */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/backgrounds/overlay-floral-yellow.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      />

      {/* Header: "the कार्यक्रम" Typography Artwork */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8 }}
        style={{
          marginBottom: '28px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <img
          src="/assets/typography/karyakram-typography.png"
          alt="the कार्यक्रम"
          style={{
            height: '68px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 2px rgba(123, 17, 19, 0.1))',
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            letterSpacing: '0.08em',
            color: '#68544E',
            marginTop: '6px',
          }}
        >
          {displayedEvents.length === 1
            ? 'a celebration to remember'
            : 'rituals of love, union & togetherness'}
        </p>
      </motion.div>

      {/* Stamps Stack */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '0 16px',
        }}
      >
        {displayedEvents.map((event, idx) => (
          <EventStamp key={event.id} event={event} index={idx} />
        ))}
      </div>

      {/* Bottom Perforated Transition */}
      <PerforatedDivider theme="red" variant="punch-row" style={{ marginTop: '16px' }} />
    </section>
  );
};
