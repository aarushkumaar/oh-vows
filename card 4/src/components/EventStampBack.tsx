import React from 'react';
import { EventItem } from '../data/types';

interface EventStampBackProps {
  event: EventItem;
  onClick: () => void;
}

export const EventStampBack: React.FC<EventStampBackProps> = ({ event, onClick }) => {
  // If custom back asset image is provided and exists, render custom image
  if (event.backAsset) {
    return (
      <div
        className="flip-card-back"
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#F7F2E7',
          padding: '12px',
          borderRadius: '3px',
          boxShadow: '0 6px 18px rgba(45, 15, 12, 0.12)',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <img
          src={event.backAsset}
          alt={`${event.name} details backside`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
        />
      </div>
    );
  }

  // Structured Vintage Indian Postcard Backside
  return (
    <div
      className="flip-card-back"
      onClick={onClick}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F4EBD9',
        border: '1px solid #D8C3A8',
        borderRadius: '3px',
        padding: '18px 16px',
        boxShadow: '0 6px 18px rgba(45, 15, 12, 0.14)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Vintage Postal Watermark Background */}
      <div
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '2px dashed rgba(123, 17, 19, 0.1)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header: Postcard Stamp & Postmark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(123, 17, 19, 0.15)',
          paddingBottom: '10px',
        }}
      >
        {/* Event Title */}
        <div>
          <span
            style={{
              fontFamily: 'var(--font-devanagari)',
              fontSize: '1.25rem',
              color: '#7B1113',
              display: 'block',
              lineHeight: 1.1,
            }}
          >
            {event.localName}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              color: '#221411',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {event.name}
          </h3>
        </div>

        {/* Small Vintage Postal Stamp */}
        <div
          style={{
            border: '1.5px dashed #7B1113',
            padding: '3px 6px',
            backgroundColor: '#FAF7F0',
            textAlign: 'center',
            minWidth: '60px',
          }}
        >
          <span
            style={{
              fontSize: '0.6rem',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7B1113',
              display: 'block',
            }}
          >
            GUL POST
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              color: '#5A0A0D',
            }}
          >
            {event.city}
          </span>
        </div>
      </div>

      {/* Middle Information Section */}
      <div style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Date & Time */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: '#7B1113', fontSize: '0.85rem' }}>✦</span>
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem', color: '#221411' }}>
              {event.date}
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: '#5D4A45' }}>
              {event.time}
            </p>
          </div>
        </div>

        {/* Venue & Location */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: '#7B1113', fontSize: '0.85rem' }}>📍</span>
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.92rem', color: '#221411' }}>
              {event.venue}
            </p>
            {event.address && (
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', color: '#68544E', lineHeight: 1.3 }}>
                {event.address}
              </p>
            )}
          </div>
        </div>

        {/* Event Narrative Note */}
        {event.description && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.85rem',
              fontStyle: 'italic',
              color: '#4B3A36',
              lineHeight: 1.4,
              backgroundColor: 'rgba(255,255,255,0.4)',
              padding: '6px 8px',
              borderRadius: '2px',
              borderLeft: '2px solid #7B1113',
              margin: '2px 0',
            }}
          >
            {event.description}
          </p>
        )}

        {/* Dress Code & Palette */}
        {event.dressCode && (
          <div style={{ marginTop: '2px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#7B1113',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                display: 'block',
              }}
            >
              Attire: {event.dressCode}
            </span>
            {event.dressColors && event.dressColors.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', marginTop: '4px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#68544E' }}>Palette:</span>
                {event.dressColors.map((color, idx) => (
                  <span
                    key={idx}
                    title={color}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '1px solid rgba(0,0,0,0.15)',
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Links & Flip Back Cue */}
      <div
        style={{
          borderTop: '1px solid rgba(123, 17, 19, 0.15)',
          paddingTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {event.mapUrl && (
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-serif)',
                color: '#7B1113',
                textDecoration: 'none',
                border: '1px solid rgba(123, 17, 19, 0.4)',
                padding: '3px 8px',
                borderRadius: '2px',
                backgroundColor: '#FAF7F0',
              }}
            >
              Map ↗
            </a>
          )}
          {event.calendarUrl && (
            <a
              href={event.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-serif)',
                color: '#7B1113',
                textDecoration: 'none',
                border: '1px solid rgba(123, 17, 19, 0.4)',
                padding: '3px 8px',
                borderRadius: '2px',
                backgroundColor: '#FAF7F0',
              }}
            >
              Calendar +
            </a>
          )}
        </div>

        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-serif)',
            color: '#8E7A75',
            letterSpacing: '0.08em',
          }}
        >
          tap to flip ↺
        </span>
      </div>
    </div>
  );
};
