import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface OpeningProps {
  onComplete: () => void
  hasSkipped?: boolean
}

export const Opening: React.FC<OpeningProps> = ({ onComplete, hasSkipped = false }) => {
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (hasSkipped) {
      setIsCompleted(true)
      onComplete()
      return
    }

    // Animation timeline
    const timer = setTimeout(() => {
      setIsCompleted(true)
      onComplete()
    }, 5500)

    return () => clearTimeout(timer)
  }, [hasSkipped, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden paper-texture"
      style={{ backgroundColor: '#FAF6F1' }}
    >
      {/* Background red textile */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{
          backgroundColor: '#D4443D',
          mixBlendMode: 'multiply',
          opacity: 0.15,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Devanagari title - विवाह */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-6xl md:text-8xl font-devanagari font-bold text-ink mb-12"
          style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
        >
          विवाह
        </motion.h1>

        {/* Groom hand - enters from left */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 transform -translate-x-80 -translate-y-1/2"
        >
          <img
            src="/assets/hand right.png"
            alt="groom hand"
            className="w-32 md:w-48 h-auto hand-animation"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          />
        </motion.div>

        {/* Rose - appears and moves */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="text-6xl md:text-8xl">🌹</div>
        </motion.div>

        {/* Bride hand - enters from right */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
          className="absolute right-1/2 top-1/2 transform translate-x-80 -translate-y-1/2"
        >
          <img
            src="/assets/hand left.png"
            alt="bride hand"
            className="w-32 md:w-48 h-auto hand-animation"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
          />
        </motion.div>

        {/* Card name - appears at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-16 text-center"
        >
          <p className="text-sm md:text-base tracking-widest font-serif text-ink opacity-60">
            GUL
          </p>
        </motion.div>
      </div>

      {/* Skip button - appears after 1s */}
      {!isCompleted && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => {
            setIsCompleted(true)
            onComplete()
          }}
          className="absolute top-6 right-6 text-xs md:text-sm text-ink opacity-40 hover:opacity-60 transition-opacity"
        >
          skip intro
        </motion.button>
      )}
    </motion.div>
  )
}

export default Opening
