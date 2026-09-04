import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingExperienceProps {
  onComplete: () => void;
  coupleNames?: string;
}

export const LoadingExperience: React.FC<LoadingExperienceProps> = ({
  onComplete,
  coupleNames = 'person A & person B',
}) => {
  const [phase, setPhase] = useState<'animating' | 'settled' | 'exiting'>('animating');

  useEffect(() => {
    // Stage 1: Animation finishes and settles
    const timer1 = setTimeout(() => {
      setPhase('settled');
    }, 3800);

    // Stage 2: Automatic gentle transition to main invitation
    const timer2 = setTimeout(() => {
      handleProceed();
    }, 5600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleProceed = () => {
    setPhase('exiting');
    setTimeout(() => {
      onComplete();
    }, 900);
  };

  return (
    <AnimatePresence>
      {phase !== 'exiting' ? (
        <motion.div
          key="cinematic-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, y: -20 }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: '#2A1110',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Central Mobile Framed Card Canvas */}
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100vh',
              maxHeight: '920px',
              backgroundColor: '#F7F2E7',
              position: 'relative',
              boxShadow: '0 0 60px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              padding: '24px 16px',
            }}
          >
            {/* Top Bar: Skip button & Micro-header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                paddingTop: '8px',
                zIndex: 20,
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#7B1113',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                }}
              >
                GUL · गुल
              </span>

              <button
                onClick={handleProceed}
                style={{
                  background: 'none',
                  border: '1px solid rgba(123, 17, 19, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-serif)',
                  color: '#7B1113',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(123, 17, 19, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Skip Intro ✕
              </button>
            </div>

            {/* Middle Cinematic Composition matching Figma */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
              }}
            >
              {/* Devanagari "विवाह" Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                style={{
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/assets/typography/vivah-devanagari.png"
                  alt="विवाह"
                  style={{
                    maxHeight: '75px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(123, 17, 19, 0.15))',
                  }}
                />
              </motion.div>

              {/* Red Floral Textile Stamp Area with The Two Hands & Rose */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  height: '270px',
                  backgroundColor: '#680D11',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '3px',
                  border: '1px solid #50070A',
                  boxShadow: '0 12px 30px rgba(70, 9, 12, 0.25)',
                }}
              >
                {/* Damask Floral Overlay Texture */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/assets/backgrounds/overlay-floral-red.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.45,
                    mixBlendMode: 'soft-light',
                    pointerEvents: 'none',
                  }}
                />

                {/* Scalloped Bottom Edge of Stamp */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                  }}
                >
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#F7F2E7',
                        marginTop: '4px',
                      }}
                    />
                  ))}
                </div>

                {/* Hand Animation Layers */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Bride Hand Layer (holding rose) */}
                  <motion.div
                    initial={{ x: -90, y: -20, rotate: -6, opacity: 0 }}
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 2.4,
                      delay: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      position: 'absolute',
                      left: '8%',
                      top: '12%',
                      zIndex: 10,
                      transformOrigin: 'top left',
                    }}
                  >
                    <img
                      src="/assets/hands/hand-bride.png"
                      alt="Bride offering rose"
                      style={{
                        height: '190px',
                        width: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(2px 6px 12px rgba(0,0,0,0.45))',
                      }}
                    />
                  </motion.div>

                  {/* Groom Hand Layer (reaching to receive rose) */}
                  <motion.div
                    initial={{ x: 90, y: 25, rotate: 6, opacity: 0 }}
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 2.5,
                      delay: 1.0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      position: 'absolute',
                      right: '12%',
                      bottom: '10%',
                      zIndex: 9,
                      transformOrigin: 'bottom right',
                    }}
                  >
                    <img
                      src="/assets/hands/hand-groom.png"
                      alt="Groom receiving rose"
                      style={{
                        height: '175px',
                        width: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(-2px 6px 12px rgba(0,0,0,0.45))',
                      }}
                    />
                  </motion.div>

                  {/* Subtle Light Shimmer on Rose Meeting Point */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: [0, 0.7, 0.3],
                      scale: [0.5, 1.4, 1],
                    }}
                    transition={{
                      delay: 2.8,
                      duration: 1.6,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      top: '32%',
                      left: '48%',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,240,200,0) 70%)',
                      pointerEvents: 'none',
                      zIndex: 15,
                    }}
                  />
                </div>
              </motion.div>

              {/* Couple Names & Story Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 2.4, ease: 'easeOut' }}
                style={{
                  textAlign: 'center',
                  marginTop: '22px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.08em',
                    color: '#7B1113',
                    fontWeight: 400,
                    textTransform: 'lowercase',
                  }}
                >
                  {coupleNames}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    color: '#5D4A45',
                    marginTop: '4px',
                  }}
                >
                  two people, one very long story.
                </p>
              </motion.div>
            </div>

            {/* Bottom Invitation Enter Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.8 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBottom: '8px',
                zIndex: 20,
              }}
            >
              <button
                onClick={handleProceed}
                style={{
                  background: '#7B1113',
                  color: '#FAF7F0',
                  border: 'none',
                  padding: '10px 24px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  boxShadow: '0 4px 14px rgba(123, 17, 19, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5A0A0D';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7B1113';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Enter Invitation</span>
                <span>↓</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
