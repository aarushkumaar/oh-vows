import React from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  subtitle: string
  description: string
  personA: string
  personB: string
  imagePath?: string
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  personA,
  personB,
  imagePath,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 paper-texture"
      style={{ backgroundColor: '#FAF6F1' }}
    >
      {/* Hero image or placeholder */}
      {imagePath ? (
        <motion.img
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          src={imagePath}
          alt="Couple"
          className="w-full max-w-lg h-auto mb-12 rounded-sm shadow-lg"
        />
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full max-w-lg aspect-square mb-12 bg-paper-warm rounded-sm flex items-center justify-center border-4 border-ink border-opacity-10"
        >
          <div className="text-center">
            <p className="text-sm text-ink opacity-40">Couple Photo</p>
            <p className="text-xs text-ink opacity-30 mt-2">640 x 640px</p>
          </div>
        </motion.div>
      )}

      {/* Names */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-display text-ink mb-4">
          {personA} <span className="text-red">&</span> {personB}
        </h2>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-xl text-ink opacity-80 mb-6 max-w-md text-center font-serif"
      >
        {title}
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-base text-ink opacity-60 mb-12 max-w-lg text-center"
      >
        {description}
      </motion.p>

      {/* Decorative element */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-4xl opacity-30"
      >
        🌹
      </motion.div>
    </motion.section>
  )
}

export default Hero
