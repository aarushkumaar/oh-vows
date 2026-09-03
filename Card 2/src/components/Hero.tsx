import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Hero.css'

const Hero: React.FC = () => {
  const textGroupRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) return

    const tl = gsap.timeline()

    // Fade in hero text
    tl.fromTo(
      textGroupRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
    )

    // Show scroll hint
    tl.fromTo(
      scrollHintRef.current,
      { opacity: 0 },
      { opacity: 0.7, duration: 0.8, ease: 'power2.out' },
      '+=0.6'
    )

    // Subtle scroll hint animation
    gsap.to('.scroll-hint-line', {
      y: 8,
      opacity: 0,
      duration: 1.5,
      repeat: -1,
      ease: 'power1.inOut',
    })
  }, [prefersReduced])

  return (
    <section id="hero" className="hero" aria-label="Hero — Vartika & Hardik">
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop"
          alt="Vartika and Hardik"
          className="hero-bg-img"
        />
        <div className="hero-overlay" aria-hidden="true"></div>
      </div>

      <div className="hero-content">
        <div ref={textGroupRef} className="hero-text-group">
          <p className="eyebrow">Together Forever</p>
          <div className="gold-rule" style={{ width: 'clamp(38px, 7.5vw, 78px)' }}></div>
          <h1 className="display-title">Vartika & Hardik</h1>
          <p className="tagline">Celebrating love, family & new beginnings</p>
        </div>

        <div ref={scrollHintRef} className="scroll-hint" aria-hidden="true">
          <div className="scroll-hint-line"></div>
          <p className="scroll-hint-text">Scroll to explore</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
