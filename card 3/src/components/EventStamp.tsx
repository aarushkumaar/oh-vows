import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { EventStamp as EventStampType } from '../data/config'

interface EventStampProps {
  event: EventStampType
  index: number
}

export const EventStamp: React.FC<EventStampProps> = ({ event, index }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* 3D Flip container */}
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer h-96 md:h-[500px]"
      >
        {/* Front of stamp */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="w-full h-full rounded-lg border-4 stamp-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: event.theme.bg,
            color: event.theme.text,
          }}
        >
          <div className="p-8 h-full flex flex-col items-center justify-center text-center relative">
            {/* Illustration placeholder or actual image */}
            <div className="mb-6 text-6xl">
              {event.id === 'engagement' && '💍'}
              {event.id === 'mehendi' && '👰'}
              {event.id === 'wedding' && '💒'}
            </div>

            {/* Event name */}
            <h3 className="text-3xl md:text-4xl font-display mb-2">
              {event.name}
            </h3>

            {/* Local name */}
            <p className="text-lg md:text-xl font-devanagari mb-6" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {event.localName}
            </p>

            {/* Postal stamp element */}
            <div className="absolute top-4 right-4 border-2 w-12 h-16 opacity-30" style={{ borderColor: 'currentColor' }}>
              <div className="w-full h-full flex items-center justify-center text-xs">
                {event.date.slice(0, 4)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of stamp */}
        <motion.div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 w-full h-full rounded-lg border-4 stamp-border overflow-hidden shadow-lg"
          style={{
            backgroundColor: '#F5EFE7',
            color: '#2C2C2C',
          }}
        >
          <div className="p-8 h-full flex flex-col justify-between text-sm md:text-base">
            {/* Event details back */}
            <div className="space-y-4">
              <div>
                <p className="font-bold text-xs uppercase opacity-60 mb-1">Date & Time</p>
                <p className="text-base">{event.date}</p>
                <p className="text-base">{event.time}</p>
              </div>

              <div>
                <p className="font-bold text-xs uppercase opacity-60 mb-1">Venue</p>
                <p className="text-base">{event.venue}</p>
                <p className="text-base">{event.city}</p>
              </div>

              {event.dressCode && (
                <div>
                  <p className="font-bold text-xs uppercase opacity-60 mb-1">Dress Code</p>
                  <p className="text-base">{event.dressCode}</p>
                  {event.dressColors && (
                    <div className="flex gap-2 mt-2">
                      {event.dressColors.map((color, i) => (
                        <span key={i} className="text-xs bg-opacity-20 px-2 py-1 rounded">
                          {color}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tap to flip hint */}
            <p className="text-xs opacity-40 text-center mt-4">← Tap to flip</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Click instruction on mobile */}
      <p className="text-center text-xs opacity-40 mt-4 md:hidden">
        Tap card to flip
      </p>
    </motion.div>
  )
}

export default EventStamp
