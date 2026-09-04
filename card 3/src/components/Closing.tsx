import React from 'react'
import { motion } from 'framer-motion'

interface ClosingProps {
  title: string
  subtitle: string
  cardName: string
  cardNameHindi: string
}

export const Closing: React.FC<ClosingProps> = ({
  title,
  subtitle,
  cardName,
  cardNameHindi,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen px-4 py-16 flex flex-col items-center justify-center paper-texture overflow-hidden"
      style={{ backgroundColor: '#FAF6F1' }}
    >
      {/* Background decorative element */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-9xl opacity-10">🌹</div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        {/* Main title */}
        <h2 className="text-5xl md:text-6xl font-display text-ink mb-4">
          {title}
        </h2>

        {/* Hindi subtitle */}
        <p
          className="text-3xl md:text-4xl font-devanagari text-red mb-12"
          style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
        >
          {subtitle}
        </p>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-px bg-ink opacity-30 mx-auto mb-12"
        />

        {/* Card signature */}
        <div className="mt-16">
          <p className="text-sm tracking-widest text-ink opacity-50 mb-2">
            {cardName}
          </p>
          <p
            className="text-lg font-devanagari text-ink opacity-50"
            style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
          >
            {cardNameHindi}
          </p>
        </div>

        {/* Footer message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs text-ink opacity-40 mt-12"
        >
          With love and gratitude
        </motion.p>
      </motion.div>
    </motion.section>
  )
}

export default Closing
