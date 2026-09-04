import React from 'react'
import { motion } from 'framer-motion'

interface PhotoGalleryProps {
  title: string
  subtitle: string
  photos: string[]
  backgroundColor?: string
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  title,
  subtitle,
  photos,
  backgroundColor = '#FAF6F1',
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen px-4 py-16 flex flex-col items-center justify-center"
      style={{ backgroundColor }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-display text-ink mb-2">
          {title}
        </h2>
        <p className="text-lg text-ink opacity-60 font-serif">{subtitle}</p>
      </motion.div>

      {/* Photo grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {photos.length > 0 ? (
          photos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-sm shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={photo}
                alt={`Memory ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-ink opacity-40">
              Photography section - photos will appear here
            </p>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default PhotoGallery
