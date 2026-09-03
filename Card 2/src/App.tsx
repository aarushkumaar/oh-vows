import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import GallerySection from './components/GallerySection'
import KaaryakramSection from './components/KaaryakramSection'
import EventStamps from './components/EventStamps'
import RSVPSection from './components/RSVPSection'
import FooterSection from './components/FooterSection'

function App() {
  const [preloaderComplete, setPreloaderComplete] = React.useState(false)

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!preloaderComplete && (
                <Preloader onComplete={() => setPreloaderComplete(true)} />
              )}
              {preloaderComplete && (
                <main className="site-content">
                  <Hero />
                  <GallerySection />
                  <KaaryakramSection />
                  <EventStamps />
                  <RSVPSection />
                  <FooterSection />
                </main>
              )}
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
