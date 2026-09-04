import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface RSVPProps {
  title: string
  description: string
  onSubmit: (data: RSVPData) => void
}

export interface RSVPData {
  name: string
  guests: number
  attendance: 'yes' | 'no' | 'maybe'
  message: string
}

export const RSVP: React.FC<RSVPProps> = ({ title, description, onSubmit }) => {
  const [formData, setFormData] = useState<RSVPData>({
    name: '',
    guests: 1,
    attendance: 'yes',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen px-4 py-16 flex flex-col items-center justify-center paper-texture"
      style={{ backgroundColor: '#F5EFE7' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* RSVP card background */}
        <div
          className="p-8 md:p-12 rounded-sm border-4 shadow-lg relative"
          style={{
            backgroundColor: '#FAF6F1',
            borderColor: '#D4443D',
          }}
        >
          {/* Postal stamp decoration */}
          <div
            className="absolute top-4 right-4 w-12 h-16 border-2"
            style={{ borderColor: '#D4443D', opacity: 0.3 }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-red opacity-40">
              2026
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display text-red mb-2">
              {title}
            </h2>
            <p className="text-sm text-ink opacity-60">{description}</p>
          </div>

          {/* Form or success message */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase opacity-60 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border-b-2 border-ink border-opacity-20 focus:border-red focus:outline-none bg-transparent"
                  placeholder="Enter your name"
                />
              </div>

              {/* Number of guests */}
              <div>
                <label className="block text-xs font-bold uppercase opacity-60 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guests: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border-b-2 border-ink border-opacity-20 focus:border-red focus:outline-none bg-transparent"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className="block text-xs font-bold uppercase opacity-60 mb-3">
                  Can you attend?
                </label>
                <div className="space-y-2">
                  {(['yes', 'no', 'maybe'] as const).map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value={option}
                        checked={formData.attendance === option}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attendance: e.target.value as 'yes' | 'no' | 'maybe',
                          })
                        }
                        className="mr-3"
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase opacity-60 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border-b-2 border-ink border-opacity-20 focus:border-red focus:outline-none bg-transparent resize-none"
                  rows={3}
                  placeholder="Share your wishes..."
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 mt-8 text-sm font-bold uppercase tracking-wider border-2 border-red text-red hover:bg-red hover:text-white transition-colors"
              >
                RSVP
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-display text-red mb-2">
                See you there!
              </h3>
              <p className="text-lg font-devanagari text-red">
                मिलते हैं वहाँ
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}

export default RSVP
