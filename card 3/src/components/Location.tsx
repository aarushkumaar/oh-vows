import React from 'react'
import { motion } from 'framer-motion'

interface LocationProps {
  venue: string
  address: string
  city: string
  mapUrl?: string
}

export const Location: React.FC<LocationProps> = ({
  venue,
  address,
  city,
  mapUrl,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen px-4 py-16 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F5DCD0' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Location card */}
        <div
          className="p-8 md:p-12 rounded-sm border-4 shadow-lg"
          style={{
            backgroundColor: '#FAF6F1',
            borderColor: '#D4443D',
          }}
        >
          <h2 className="text-3xl font-display text-red mb-6 text-center">
            Venue
          </h2>

          {/* Map placeholder */}
          <div className="w-full aspect-square mb-6 bg-muted rounded-sm flex items-center justify-center border-2 border-ink border-opacity-10">
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-xs text-ink opacity-40">Map Location</p>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase opacity-60 mb-1">
                Venue
              </p>
              <p className="text-lg text-ink">{venue}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase opacity-60 mb-1">
                Address
              </p>
              <p className="text-base text-ink">{address}</p>
              <p className="text-base text-ink">{city}</p>
            </div>
          </div>

          {/* Map link */}
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center text-sm font-bold uppercase tracking-wider border-2 border-red text-red hover:bg-red hover:text-white transition-colors"
            >
              Open in Maps
            </a>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}

export default Location
