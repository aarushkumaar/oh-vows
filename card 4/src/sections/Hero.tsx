import React from 'react';
import { motion } from 'framer-motion';
import { HeroConfig, CoupleConfig } from '../data/types';
import { PerforatedDivider } from '../components/PerforatedDivider';

interface HeroProps {
  hero: HeroConfig;
  couple: CoupleConfig;
}

export const Hero: React.FC<HeroProps> = ({ hero, couple }) => {
  return (
    <section
      className="hero-section"
      style={{
        width: '100%',
        backgroundColor: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 1. TOP BANNER: Warm Ivory + Devanagari विवाह + Red Textile + Hands */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#F7F2E7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
        }}
      >
        {/* Devanagari Title "विवाह" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            padding: '4px 16px 12px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src="/assets/typography/vivah-devanagari.png"
            alt="विवाह"
            style={{
              height: '70px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </motion.div>

        {/* Deep Red Floral Textile Stamp with Hands & Rose */}
        <div
          style={{
            width: '100%',
            height: '240px',
            backgroundColor: '#680D11',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Floral Damask Texture Overlay */}
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

          {/* Hands & Rose Layered Composition */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Bride Hand holding Rose */}
            <motion.div
              initial={{ x: -20, opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '6%',
                top: '10%',
                zIndex: 4,
              }}
            >
              <img
                src="/assets/hands/hand-bride.png"
                alt="Bride Hand"
                style={{
                  height: '190px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.4))',
                }}
              />
            </motion.div>

            {/* Groom Hand receiving Rose */}
            <motion.div
              initial={{ x: 20, opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                right: '10%',
                bottom: '8%',
                zIndex: 3,
              }}
            >
              <img
                src="/assets/hands/hand-groom.png"
                alt="Groom Hand"
                style={{
                  height: '175px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(-2px 4px 8px rgba(0,0,0,0.4))',
                }}
              />
            </motion.div>
          </div>

          {/* Scalloped Bottom Edge */}
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
              zIndex: 10,
            }}
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#5A0A0D',
                  marginTop: '4px',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Perforated Separator Row */}
      <PerforatedDivider theme="red" variant="punch-row" />

      {/* 2. COUPLE PHOTOGRAPH: Sunset Silhouette with Overlay Typography */}
      <div
        style={{
          width: '100%',
          position: 'relative',
          backgroundColor: '#1E1210',
          overflow: 'hidden',
          minHeight: '260px',
        }}
      >
        <img
          src={hero.image}
          alt={`${couple.personA} & ${couple.personB}`}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '320px',
            objectFit: 'cover',
            display: 'block',
            filter: 'contrast(1.05) brightness(0.95)',
          }}
          loading="eager"
        />

        {/* Soft Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(30,15,12,0.45) 0%, rgba(30,15,12,0.1) 40%, rgba(30,15,12,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Overlaid Typography matching Figma: "person A & person B" */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: '0 16px',
            zIndex: 5,
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#FAF7F0',
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              textTransform: 'lowercase',
            }}
          >
            {hero.title || `${couple.personA} & ${couple.personB}`}
          </h1>
        </div>

        {/* Bottom Subtitle / Date */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: '0 16px',
            zIndex: 5,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              color: '#F4EBD9',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {couple.storyLine}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#E0983A',
              marginTop: '4px',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {couple.weddingDate} · {couple.city}
          </p>
        </div>
      </div>

      {/* Perforated Separator Row */}
      <PerforatedDivider theme="red" variant="punch-row" />
    </section>
  );
};
