import React from 'react'
import './GallerySection.css'

const GallerySection: React.FC = () => {
  const frames = [
    { id: 1, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop' },
    { id: 2, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop' },
    { id: 3, src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=500&fit=crop' },
    { id: 4, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=400&fit=crop' },
  ]

  return (
    <section id="gallery-section" className="gallery-section" aria-label="Our Journey">
      <div className="section-head">
        <h2 className="display-title">Our Journey</h2>
      </div>

      <div className="frames-grid">
        {frames.map((frame) => (
          <div key={frame.id} className="frame-item" data-fi={frame.id}>
            <img
              src={frame.src}
              alt={`Journey frame ${frame.id}`}
              className="progressive-img frame-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default GallerySection
