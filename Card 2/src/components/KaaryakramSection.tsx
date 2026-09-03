import React from 'react'
import './KaaryakramSection.css'

const KaaryakramSection: React.FC = () => {
  return (
    <section id="kaaryakram-section" className="kaaryakram-section" aria-label="The Celebrations">
      <div className="kaaryakram-bg" aria-hidden="true"></div>

      <div className="kaaryakram-content">
        <div className="section-head">
          <p className="eyebrow">The Celebrations</p>
          <div className="gold-rule"></div>
          <h2 className="display-title">Jashn-e-Bahar</h2>
          <p className="tagline">A season of love, laughter, and celebration.</p>
        </div>

        <p className="kaaryakram-subtitle">Tap each event for details</p>
      </div>
    </section>
  )
}

export default KaaryakramSection
