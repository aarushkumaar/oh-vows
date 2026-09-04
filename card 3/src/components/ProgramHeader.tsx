import React from 'react'
import { motion } from 'framer-motion'

export const ProgramHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2
        className="text-5xl md:text-6xl font-devanagari text-red mb-4"
        style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
      >
        कार्यक्रम
      </h2>
      <p className="text-lg text-ink opacity-60 font-serif">The Program</p>
    </motion.div>
  )
}

export default ProgramHeader
