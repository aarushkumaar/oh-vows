import React, { useState } from 'react';
import { WeddingCardConfig, EventItem } from '../data/types';

interface AdminPanelProps {
  config: WeddingCardConfig;
  onUpdateConfig: (newConfig: WeddingCardConfig) => void;
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  onSelectRoute: (slug: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  onUpdateConfig,
  isOpen,
  onClose,
  activeRoute,
  onSelectRoute,
}) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'couple' | 'hero' | 'events' | 'rsvp' | 'location' | 'closing' | 'routes' | 'export'
  >('general');

  if (!isOpen) return null;

  // Helpers to update config sections
  const updateCouple = (field: string, val: string) => {
    onUpdateConfig({
      ...config,
      couple: { ...config.couple, [field]: val },
    });
  };

  const updateHero = (field: string, val: string) => {
    onUpdateConfig({
      ...config,
      hero: { ...config.hero, [field]: val },
    });
  };

  const updateRSVP = (field: string, val: any) => {
    onUpdateConfig({
      ...config,
      rsvp: { ...config.rsvp, [field]: val },
    });
  };

  const updateLocation = (field: string, val: any) => {
    onUpdateConfig({
      ...config,
      location: { ...config.location, [field]: val },
    });
  };

  const updateEventField = (index: number, field: keyof EventItem, val: any) => {
    const updated = [...config.events];
    updated[index] = { ...updated[index], [field]: val };
    onUpdateConfig({ ...config, events: updated });
  };

  const addEvent = () => {
    const newEvt: EventItem = {
      id: `event-${Date.now()}`,
      name: 'New Celebration',
      localName: 'उत्सव',
      date: 'Date & Month 2026',
      time: '6:00 PM onwards',
      venue: 'Heritage Venue',
      city: config.couple.city,
      description: 'A special evening with our loved ones.',
      dressCode: 'Festive Indian',
      dressColors: ['#7B1113', '#B89047'],
      mapUrl: 'https://maps.google.com',
      calendarUrl: '#',
      illustration: '/assets/illustrations/rings/engagement-stamp.png',
      enabled: true,
    };
    onUpdateConfig({ ...config, events: [...config.events, newEvt] });
  };

  const deleteEvent = (index: number) => {
    if (config.events.length <= 1) {
      alert('Must have at least one event in the invitation.');
      return;
    }
    const updated = config.events.filter((_, i) => i !== index);
    onUpdateConfig({ ...config, events: updated });
  };

  const duplicateEvent = (index: number) => {
    const toDuplicate = config.events[index];
    const duplicated: EventItem = {
      ...toDuplicate,
      id: `${toDuplicate.id}-copy-${Date.now()}`,
      name: `${toDuplicate.name} (Copy)`,
    };
    const updated = [...config.events];
    updated.splice(index + 1, 0, duplicated);
    onUpdateConfig({ ...config, events: updated });
  };

  const toggleEvent = (index: number) => {
    const updated = [...config.events];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    onUpdateConfig({ ...config, events: updated });
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${config.cardName.toLowerCase()}-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#FAF7F0',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #D8C3A8',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div
          style={{
            backgroundColor: '#5A0A0D',
            color: '#FAF7F0',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#E0983A',
              }}
            >
              INVITATION ENGINE CONTROL
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: '#FAF7F0',
              }}
            >
              Admin & Content Model — {config.cardName} (गुल)
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#FAF7F0',
              padding: '4px 12px',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: 'var(--font-serif)',
            }}
          >
            Close ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F4EBD9',
            borderBottom: '1px solid #D8C3A8',
            overflowX: 'auto',
            padding: '0 8px',
          }}
        >
          {[
            { id: 'general', label: 'General' },
            { id: 'couple', label: 'Couple' },
            { id: 'hero', label: 'Hero' },
            { id: 'events', label: `Events (${config.events.length})` },
            { id: 'rsvp', label: 'RSVP' },
            { id: 'location', label: 'Location' },
            { id: 'routes', label: 'Variant Preview' },
            { id: 'export', label: 'Export JSON' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 14px',
                border: 'none',
                background: activeTab === tab.id ? '#FAF7F0' : 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid #7B1113' : 'none',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#7B1113' : '#68544E',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* 1. GENERAL TAB */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Card Name (English)
                </label>
                <input
                  type="text"
                  value={config.cardName}
                  onChange={(e) => onUpdateConfig({ ...config, cardName: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Card Name (Devanagari Hindi)
                </label>
                <input
                  type="text"
                  value={config.cardNameHindi}
                  onChange={(e) => onUpdateConfig({ ...config, cardNameHindi: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  City & Destination
                </label>
                <input
                  type="text"
                  value={config.couple.city}
                  onChange={(e) => updateCouple('city', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* 2. COUPLE TAB */}
          {activeTab === 'couple' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Person A (Bride / First Partner)
                </label>
                <input
                  type="text"
                  value={config.couple.personA}
                  onChange={(e) => updateCouple('personA', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Person B (Groom / Second Partner)
                </label>
                <input
                  type="text"
                  value={config.couple.personB}
                  onChange={(e) => updateCouple('personB', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Story Line / Quote
                </label>
                <input
                  type="text"
                  value={config.couple.storyLine}
                  onChange={(e) => updateCouple('storyLine', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Wedding Dates
                </label>
                <input
                  type="text"
                  value={config.couple.weddingDate}
                  onChange={(e) => updateCouple('weddingDate', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* 3. HERO TAB */}
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Hero Headline Title
                </label>
                <input
                  type="text"
                  value={config.hero.title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Hero Image Path / URL
                </label>
                <input
                  type="text"
                  value={config.hero.image}
                  onChange={(e) => updateHero('image', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#68544E', fontStyle: 'italic' }}>
                Tip: Replacing the hero photograph preserves the exact object-position, crop, and typography overlays!
              </p>
            </div>
          )}

          {/* 4. EVENTS TAB */}
          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#5A0A0D' }}>
                  Manage Program Stamps
                </span>
                <button
                  onClick={addEvent}
                  style={{
                    backgroundColor: '#7B1113',
                    color: '#FAF7F0',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  + Add Event
                </button>
              </div>

              {config.events.map((evt, idx) => (
                <div
                  key={evt.id}
                  style={{
                    border: '1px solid #D8C3A8',
                    padding: '14px',
                    borderRadius: '3px',
                    backgroundColor: evt.enabled !== false ? '#FAF7F0' : '#F0EBE3',
                    opacity: evt.enabled !== false ? 1 : 0.65,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#7B1113' }}>
                      {idx + 1}. {evt.name} ({evt.localName})
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => toggleEvent(idx)}
                        style={{ ...actionBtnStyle, backgroundColor: evt.enabled !== false ? '#E0983A' : '#8E7A75' }}
                      >
                        {evt.enabled !== false ? 'Enabled' : 'Disabled'}
                      </button>
                      <button onClick={() => duplicateEvent(idx)} style={actionBtnStyle}>
                        Duplicate
                      </button>
                      <button
                        onClick={() => deleteEvent(idx)}
                        style={{ ...actionBtnStyle, backgroundColor: '#8C191B' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#68544E' }}>Title (English)</label>
                      <input
                        type="text"
                        value={evt.name}
                        onChange={(e) => updateEventField(idx, 'name', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#68544E' }}>Title (Hindi)</label>
                      <input
                        type="text"
                        value={evt.localName}
                        onChange={(e) => updateEventField(idx, 'localName', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#68544E' }}>Date</label>
                      <input
                        type="text"
                        value={evt.date}
                        onChange={(e) => updateEventField(idx, 'date', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#68544E' }}>Time</label>
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => updateEventField(idx, 'time', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', color: '#68544E' }}>Venue</label>
                      <input
                        type="text"
                        value={evt.venue}
                        onChange={(e) => updateEventField(idx, 'venue', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', color: '#68544E' }}>Dress Code</label>
                      <input
                        type="text"
                        value={evt.dressCode}
                        onChange={(e) => updateEventField(idx, 'dressCode', e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. RSVP TAB */}
          {activeTab === 'rsvp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Family Name on RSVP
                </label>
                <input
                  type="text"
                  value={config.rsvp.familyName}
                  onChange={(e) => updateRSVP('familyName', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  RSVP Subtitle Note
                </label>
                <input
                  type="text"
                  value={config.rsvp.subtitle}
                  onChange={(e) => updateRSVP('subtitle', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* 6. LOCATION TAB */}
          {activeTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Main Venue Name
                </label>
                <input
                  type="text"
                  value={config.location.venue}
                  onChange={(e) => updateLocation('venue', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Address
                </label>
                <input
                  type="text"
                  value={config.location.address}
                  onChange={(e) => updateLocation('address', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={config.location.googleMapsUrl}
                  onChange={(e) => updateLocation('googleMapsUrl', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7B1113', fontWeight: 600 }}>
                  Guest Directions Note
                </label>
                <input
                  type="text"
                  value={config.location.landmarkNote}
                  onChange={(e) => updateLocation('landmarkNote', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* 7. ROUTES / VARIANTS PREVIEW */}
          {activeTab === 'routes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.85rem', color: '#68544E' }}>
                Test how the invitation dynamically adapts visible event stamps for specific guests without duplicating pages!
              </p>
              {[
                { slug: '', label: 'All Events (Complete /all)', desc: 'Engagement, Mehendi, Wedding' },
                { slug: 'bride/2', label: 'Bride Side Intimate (/bride/2)', desc: 'Engagement & Wedding' },
                { slug: 'bride/3', label: 'Bride Side Full (/bride/3)', desc: 'Engagement, Mehendi & Wedding' },
                { slug: 'groom/T', label: 'Groom Side Complete (/groom/T)', desc: 'Engagement, Mehendi, Wedding' },
                { slug: 'groom/R', label: 'Wedding Only (/groom/R)', desc: 'Wedding Ceremony Only' },
              ].map((rt) => (
                <div
                  key={rt.slug}
                  onClick={() => onSelectRoute(rt.slug)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '3px',
                    border: activeRoute === rt.slug ? '2px solid #7B1113' : '1px solid #D8C3A8',
                    backgroundColor: activeRoute === rt.slug ? '#FAF2E6' : '#FAF7F0',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4 style={{ color: '#7B1113', fontSize: '0.95rem' }}>{rt.label}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#68544E', marginTop: '2px' }}>{rt.desc}</p>
                  </div>
                  {activeRoute === rt.slug && (
                    <span style={{ color: '#7B1113', fontWeight: 600, fontSize: '0.8rem' }}>Active ✓</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 8. EXPORT JSON TAB */}
          {activeTab === 'export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.85rem', color: '#68544E' }}>
                Export this card configuration as clean JSON for database syncing (Supabase / PostgreSQL) or production backup.
              </p>
              <button
                onClick={exportJSON}
                style={{
                  backgroundColor: '#7B1113',
                  color: '#FAF7F0',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Download {config.cardName}-config.json ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  marginTop: '4px',
  border: '1px solid #D8C3A8',
  backgroundColor: '#FAF7F0',
  fontFamily: 'var(--font-serif)',
  fontSize: '0.9rem',
  color: '#221411',
  borderRadius: '2px',
  outline: 'none',
};

const actionBtnStyle: React.CSSProperties = {
  backgroundColor: '#68544E',
  color: '#FAF7F0',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '2px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontFamily: 'var(--font-serif)',
};
