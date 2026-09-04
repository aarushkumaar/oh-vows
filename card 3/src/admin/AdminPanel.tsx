import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingCardConfig } from '../data/config'

interface AdminPanelProps {
  config: WeddingCardConfig
  onUpdate: (config: WeddingCardConfig) => void
  onClose: () => void
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'couple' | 'hero' | 'events' | 'rsvp' | 'location'>('general')
  const [localConfig, setLocalConfig] = useState(config)

  const handleSave = () => {
    onUpdate(localConfig)
    alert('Configuration saved!')
  }

  const updateCouple = (key: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      couple: {
        ...localConfig.couple,
        [key]: value,
      },
    })
  }

  const updateHero = (key: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      hero: {
        ...localConfig.hero,
        [key]: value,
      },
    })
  }

  const updateEvent = (eventId: string, key: string, value: any) => {
    setLocalConfig({
      ...localConfig,
      events: localConfig.events.map(e =>
        e.id === eventId ? { ...e, [key]: value } : e
      ),
    })
  }

  const updateLocation = (key: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      location: {
        ...localConfig.location,
        [key]: value,
      },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-ink">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-2xl text-ink opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['general', 'couple', 'hero', 'events', 'rsvp', 'location'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold uppercase whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-red text-white'
                  : 'bg-gray-200 text-ink hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Card Name</label>
                <input
                  type="text"
                  value={localConfig.cardName}
                  onChange={e =>
                    setLocalConfig({ ...localConfig, cardName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Card Name (Hindi)</label>
                <input
                  type="text"
                  value={localConfig.cardNameHindi}
                  onChange={e =>
                    setLocalConfig({ ...localConfig, cardNameHindi: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}

          {activeTab === 'couple' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Person A Name</label>
                <input
                  type="text"
                  value={localConfig.couple.personA}
                  onChange={e => updateCouple('personA', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Person B Name</label>
                <input
                  type="text"
                  value={localConfig.couple.personB}
                  onChange={e => updateCouple('personB', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Initials</label>
                <input
                  type="text"
                  value={localConfig.couple.initials}
                  onChange={e => updateCouple('initials', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}

          {activeTab === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={localConfig.hero.title}
                  onChange={e => updateHero('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={localConfig.hero.subtitle}
                  onChange={e => updateHero('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea
                  value={localConfig.hero.description}
                  onChange={e => updateHero('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                />
              </div>
            </>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {localConfig.events.map(event => (
                <div key={event.id} className="border-t pt-4">
                  <h3 className="font-bold mb-2">{event.name}</h3>
                  <div>
                    <label className="block text-xs font-bold mb-1">Date</label>
                    <input
                      type="text"
                      value={event.date}
                      onChange={e => updateEvent(event.id, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-bold mb-1">Time</label>
                    <input
                      type="text"
                      value={event.time}
                      onChange={e => updateEvent(event.id, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-bold mb-1">Venue</label>
                    <input
                      type="text"
                      value={event.venue}
                      onChange={e => updateEvent(event.id, 'venue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rsvp' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">RSVP Title</label>
                <input
                  type="text"
                  value={localConfig.rsvp.title}
                  onChange={e =>
                    setLocalConfig({
                      ...localConfig,
                      rsvp: { ...localConfig.rsvp, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">RSVP Description</label>
                <textarea
                  value={localConfig.rsvp.description}
                  onChange={e =>
                    setLocalConfig({
                      ...localConfig,
                      rsvp: { ...localConfig.rsvp, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.rsvp.enabled}
                    onChange={e =>
                      setLocalConfig({
                        ...localConfig,
                        rsvp: { ...localConfig.rsvp, enabled: e.target.checked },
                      })
                    }
                  />
                  <span className="text-sm font-bold">RSVP Enabled</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'location' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Venue</label>
                <input
                  type="text"
                  value={localConfig.location.venue}
                  onChange={e => updateLocation('venue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Address</label>
                <input
                  type="text"
                  value={localConfig.location.address}
                  onChange={e => updateLocation('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">City</label>
                <input
                  type="text"
                  value={localConfig.location.city}
                  onChange={e => updateLocation('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Map URL</label>
                <input
                  type="text"
                  value={localConfig.location.mapUrl || ''}
                  onChange={e => updateLocation('mapUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-red text-white font-bold uppercase rounded hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  )
}

export default AdminPanel
