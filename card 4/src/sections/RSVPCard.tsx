import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RSVPConfig } from '../data/types';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface RSVPCardProps {
  rsvp: RSVPConfig;
}

export const RSVPCard: React.FC<RSVPCardProps> = ({ rsvp }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    attendance: 'Joyfully Accepts (हाँ, अवश्य आएँगे)',
    guestCount: '2',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName.trim()) return;

    setIsSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section
      className="rsvp-section"
      style={{
        width: '100%',
        backgroundColor: '#5A0A0D',
        padding: '32px 18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Background Subtle Damask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/backgrounds/overlay-floral-red.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />

      {/* Main Wedding Stationery RSVP Card matching Figma */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#F7F2E7',
          border: '1px solid #D4C3AC',
          borderRadius: '2px',
          padding: '24px 20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Top Header matching Figma: RSVP typography, script family name & wax seal stamp */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(123, 17, 19, 0.2)',
            paddingBottom: '14px',
            marginBottom: '18px',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                color: '#7B1113',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {rsvp.title || 'RSVP'}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                color: '#68544E',
                marginTop: '4px',
              }}
            >
              {rsvp.subtitle || 'We would love to celebrate with you'}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: '1.55rem',
                color: '#7B1113',
                lineHeight: 1.2,
                marginTop: '8px',
              }}
            >
              {rsvp.familyName || 'The Family Name'}
            </p>
          </div>

          {/* Postal Stamp with Seal Asset or Graphic */}
          <div
            style={{
              position: 'relative',
              width: '90px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/rsvp/rsvp-header.png"
              alt="RSVP Stamp"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(123, 17, 19, 0.15))',
              }}
            />
          </div>
        </div>

        {/* Content Body: Interactive Form or Stamped Confirmation */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="rsvp-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Guest Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7B1113',
                    marginBottom: '4px',
                  }}
                >
                  Your Name(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika & Kunal"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 4px',
                    border: 'none',
                    borderBottom: '1.5px solid #7B1113',
                    backgroundColor: 'transparent',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    color: '#221411',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Attendance Selection */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7B1113',
                    marginBottom: '6px',
                  }}
                >
                  Will you join us? *
                </label>
                <select
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid rgba(123, 17, 19, 0.3)',
                    backgroundColor: '#FAF7F0',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.9rem',
                    color: '#221411',
                    outline: 'none',
                    borderRadius: '2px',
                  }}
                >
                  <option value="Joyfully Accepts (हाँ, अवश्य आएँगे)">Joyfully Accepts (हाँ, अवश्य आएँगे)</option>
                  <option value="Regretfully Declines (क्षमा, नहीं आ पाएँगे)">Regretfully Declines (क्षमा, नहीं आ पाएँगे)</option>
                  <option value="Still Deciding">Still Deciding (जल्द बताएंगे)</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7B1113',
                    marginBottom: '4px',
                  }}
                >
                  Number of Guests Attending
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 4px',
                    border: 'none',
                    borderBottom: '1.5px solid #7B1113',
                    backgroundColor: 'transparent',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    color: '#221411',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Message / Blessing */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#7B1113',
                    marginBottom: '4px',
                  }}
                >
                  A Warm Blessing / Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Leave a note for the couple..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid rgba(123, 17, 19, 0.25)',
                    backgroundColor: '#FAF7F0',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.9rem',
                    color: '#221411',
                    outline: 'none',
                    borderRadius: '2px',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Submit Button styled like an authentic wax seal or postal stamp */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '8px',
                  backgroundColor: '#7B1113',
                  color: '#FAF7F0',
                  border: '1px solid #5A0A0D',
                  padding: '11px 20px',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  boxShadow: '0 4px 12px rgba(123, 17, 19, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5A0A0D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7B1113';
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send RSVP · उत्तर भेजें'}
              </button>
            </motion.form>
          ) : (
            /* Stamped Confirmation State */
            <motion.div
              key="rsvp-confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                textAlign: 'center',
                padding: '24px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Devanagari "आपका इंतज़ार रहेगा" Stamp */}
              <img
                src="/assets/typography/aapka-intazaar-rahega.png"
                alt="आपका इंतज़ार रहेगा"
                style={{
                  height: '65px',
                  width: 'auto',
                  objectFit: 'contain',
                  marginBottom: '16px',
                }}
              />

              {/* Postal Wax Confirmation Badge */}
              <div
                style={{
                  border: '2px dashed #7B1113',
                  padding: '8px 24px',
                  backgroundColor: '#FAF7F0',
                  transform: 'rotate(-2deg)',
                  margin: '8px 0 16px',
                  boxShadow: '0 4px 12px rgba(123, 17, 19, 0.15)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    color: '#7B1113',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  SEE YOU THERE
                </h3>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.95rem',
                  color: '#5D4A45',
                  fontStyle: 'italic',
                  maxWidth: '300px',
                  lineHeight: 1.5,
                }}
              >
                Thank you, {formData.guestName}. Your response has been warmly received by the family.
              </p>

              <button
                onClick={() => setIsSubmitted(false)}
                style={{
                  marginTop: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#7B1113',
                  textDecoration: 'underline',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-serif)',
                  cursor: 'pointer',
                }}
              >
                Edit your response
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Perforated Transition */}
      <PerforatedDivider theme="red" variant="punch-row" style={{ marginTop: '24px' }} />
    </section>
  );
};
