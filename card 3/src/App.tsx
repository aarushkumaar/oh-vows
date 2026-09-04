import React, { useState } from 'react'
import Opening from './components/Opening'
import Hero from './components/Hero'
import EventStamp from './components/EventStamp'
import PhotoGallery from './components/PhotoGallery'
import Closing from './components/Closing'
import RSVP, { RSVPData } from './components/RSVP'
import Location from './components/Location'
import AdminPanel from './admin/AdminPanel'
import { gulConfig, routeConfig } from './data/config'

function App() {
  const [showOpening, setShowOpening] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [config, setConfig] = useState(gulConfig)

  // Get route from URL search params
  const urlParams = new URLSearchParams(window.location.search)
  const routePath = urlParams.get('route') || '/all'
  const route = routeConfig[routePath as keyof typeof routeConfig] || routeConfig['/all']
  const visibleEvents = config.events.filter(event => route.events.includes(event.id))

  const handleOpeningComplete = () => {
    setShowOpening(false)
  }

  const handleRSVP = (data: RSVPData) => {
    console.log('RSVP Submission:', data)
    // In production, this would send to a backend
  }

  const handleAdminUpdate = (updatedConfig: typeof gulConfig) => {
    setConfig(updatedConfig)
  }

  return (
    <div className="w-full min-h-screen bg-paper">
      {/* Opening animation */}
      {showOpening && <Opening onComplete={handleOpeningComplete} />}

      {/* Main content - only show after opening completes */}
      {!showOpening && (
        <div className="relative">
          {/* Admin toggle - bottom right corner */}
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="fixed bottom-4 right-4 z-40 px-3 py-1 text-xs bg-ink opacity-10 hover:opacity-20 transition-opacity rounded"
            title="Toggle Admin Panel"
          >
            ⚙
          </button>

          {showAdmin && (
            <AdminPanel
              config={config}
              onUpdate={handleAdminUpdate}
              onClose={() => setShowAdmin(false)}
            />
          )}

          {/* Main invitation */}
          <main className="relative">
            {/* Hero section */}
            <Hero
              title={config.hero.title}
              subtitle={config.hero.subtitle}
              description={config.hero.description}
              personA={config.couple.personA}
              personB={config.couple.personB}
              imagePath={config.hero.image}
            />

            {/* Program section - Event stamps */}
            <section
              className="relative min-h-screen px-4 py-16 flex flex-col items-center justify-center paper-texture"
              style={{ backgroundColor: '#F5EFE7' }}
            >
              <div className="w-full max-w-6xl">
                {/* Section header */}
                <div className="text-center mb-16">
                  <h2
                    className="text-5xl md:text-6xl font-devanagari text-red mb-4"
                    style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                  >
                    कार्यक्रम
                  </h2>
                  <p className="text-lg text-ink opacity-60">The Program</p>
                </div>

                {/* Events grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {visibleEvents.map((event, idx) => (
                    <EventStamp key={event.id} event={event} index={idx} />
                  ))}
                </div>
              </div>
            </section>

            {/* Photo gallery */}
            {config.photos.memoryPhotos.length > 0 && (
              <PhotoGallery
                title="Our Story"
                subtitle="हमारी कहानी"
                photos={config.photos.memoryPhotos}
                backgroundColor="#FAF6F1"
              />
            )}

            {/* RSVP */}
            {config.rsvp.enabled && (
              <RSVP
                title={config.rsvp.title}
                description={config.rsvp.description}
                onSubmit={handleRSVP}
              />
            )}

            {/* Location */}
            <Location
              venue={config.location.venue}
              address={config.location.address}
              city={config.location.city}
              mapUrl={config.location.mapUrl}
            />

            {/* Closing */}
            <Closing
              title={config.closing.title}
              subtitle={config.closing.subtitle}
              cardName={config.cardName}
              cardNameHindi={config.cardNameHindi}
            />
          </main>
        </div>
      )}
    </div>
  )
}

export default App
