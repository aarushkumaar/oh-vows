import React from 'react';
import { motion } from 'framer-motion';
import { StorySectionItem } from '../data/types';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface StorySectionProps {
  stories: StorySectionItem[];
}

export const StorySection: React.FC<StorySectionProps> = ({ stories }) => {
  return (
    <div className="story-scroll-container" style={{ width: '100%', position: 'relative' }}>
      {stories.map((story, index) => {
        const isRedTheme = story.backgroundTheme === 'red';
        const bgColor = isRedTheme ? '#5A0A0D' : '#F7F2E7';
        const textColor = isRedTheme ? '#FAF7F0' : '#221411';
        const mutedTextColor = isRedTheme ? '#E8C5C8' : '#68544E';
        const accentColor = isRedTheme ? '#E0983A' : '#7B1113';

        return (
          <React.Fragment key={story.id || index}>
            <section
              style={{
                width: '100%',
                backgroundColor: bgColor,
                color: textColor,
                padding: '44px 24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Subtle Damask Floral Overlay for Red Theme */}
              {isRedTheme && (
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
              )}

              {/* Tagline / Microcopy */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: accentColor,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                — {story.tagline} —
              </motion.span>

              {/* Devanagari Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontFamily: 'var(--font-devanagari)',
                  fontSize: '1.9rem',
                  fontWeight: 400,
                  color: isRedTheme ? '#FAF7F0' : '#7B1113',
                  margin: '4px 0 6px',
                  letterSpacing: '0.02em',
                }}
              >
                {story.headingHindi}
              </motion.h2>

              {/* English Subheading */}
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: mutedTextColor,
                  fontWeight: 400,
                  marginBottom: '18px',
                }}
              >
                {story.headingEnglish}
              </motion.h3>

              {/* Story Narrative Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: 0.25 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  color: mutedTextColor,
                  maxWidth: '360px',
                  margin: '0 auto 20px',
                }}
              >
                {story.text}
              </motion.p>

              {/* Callout Quote */}
              {story.quote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  style={{
                    borderLeft: `2px solid ${accentColor}`,
                    borderRight: `2px solid ${accentColor}`,
                    padding: '8px 16px',
                    margin: '8px auto 0',
                    maxWidth: '320px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.92rem',
                      fontStyle: 'italic',
                      color: isRedTheme ? '#FAF7F0' : '#7B1113',
                    }}
                  >
                    {story.quote}
                  </p>
                </motion.div>
              )}
            </section>

            {/* Perforated Transition Divider */}
            <PerforatedDivider theme={isRedTheme ? 'red' : 'ivory'} variant="punch-row" />
          </React.Fragment>
        );
      })}
    </div>
  );
};
