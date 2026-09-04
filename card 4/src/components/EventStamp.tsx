import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EventItem } from '../data/types';
import { EventStampFront } from './EventStampFront';
import { EventStampBack } from './EventStampBack';

interface EventStampProps {
  event: EventItem;
  index: number;
}

export const EventStamp: React.FC<EventStampProps> = ({ event, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }}
      className={`flip-card-container ${isFlipped ? 'is-flipped' : ''}`}
      style={{
        width: '100%',
        maxWidth: '310px',
        height: '380px',
        margin: '0 auto 28px',
        perspective: '1200px',
      }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
    >
      <div
        className="flip-card-inner"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0.0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer',
        }}
      >
        <EventStampFront event={event} onClick={handleFlip} />
        <EventStampBack event={event} onClick={handleFlip} />
      </div>
    </motion.div>
  );
};
