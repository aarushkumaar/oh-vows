import React from 'react';
import { EventItem } from '../data/types';

interface EventStampFrontProps {
  event: EventItem;
  onClick: () => void;
}

export const EventStampFront: React.FC<EventStampFrontProps> = ({ event, onClick }) => {
  return (
    <div
      className="flip-card-front"
      onClick={onClick}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F7F2E7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        borderRadius: '3px',
        boxShadow: '0 6px 18px rgba(45, 15, 12, 0.12), 0 2px 6px rgba(45, 15, 12, 0.08)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Stamp Illustration Container */}
      <div
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '4px',
        }}
      >
        {/* If custom front stamp image exists, render it */}
        {event.frontAsset || event.illustration ? (
          <img
            src={event.frontAsset || event.illustration}
            alt={`${event.name} Stamp`}
            style={{
              maxHeight: '280px',
              maxWidth: '92%',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 4px rgba(123, 17, 19, 0.08))',
            }}
          />
        ) : (
          /* Graceful Fallback Frame matching the stamp aesthetic */
          <div
            style={{
              width: '85%',
              height: '240px',
              border: '2px solid #7B1113',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <span style={{ fontSize: '2rem' }}>✦</span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                color: '#7B1113',
                fontSize: '1.2rem',
                marginTop: '8px',
              }}
            >
              {event.name}
            </span>
          </div>
        )}
      </div>

      {/* Handwritten / Script Event Title matching Figma below the stamp */}
      <div
        style={{
          marginTop: '6px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: '1.75rem',
            color: '#7B1113',
            lineHeight: 1.1,
            letterSpacing: '0.02em',
          }}
        >
          {event.name}
        </p>
        <span
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#8E7A75',
            fontFamily: 'var(--font-serif)',
            display: 'block',
            marginTop: '2px',
          }}
        >
          tap to flip for details ↻
        </span>
      </div>
    </div>
  );
};
