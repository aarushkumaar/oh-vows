import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Preloader.css'

interface PreloaderProps {
  onComplete: () => void
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const handLeftRef = useRef<HTMLImageElement>(null)
  const handRightRef = useRef<HTMLImageElement>(null)
  const roseWrapRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) {
      setTimeout(() => onComplete(), 1500)
      return
    }

    animatePreloader()

    return () => {
      if (preloaderRef.current) {
        gsap.killTweensOf(preloaderRef.current)
      }
    }
  }, [onComplete, prefersReduced])

  const animatePreloader = () => {
    const tl = gsap.timeline({ onComplete })

    // Hands converge from left and right
    tl.fromTo(
      handLeftRef.current,
      { x: -150, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
      0
    )

    tl.fromTo(
      handRightRef.current,
      { x: 150, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
      0
    )

    // Rose pulse on contact
    tl.to(
      roseWrapRef.current,
      { scale: 1.08, duration: 0.3, ease: 'back.out' },
      1.5
    )

    tl.to(roseWrapRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out' }, '+=0.1')

    // Show hint after handoff
    tl.to(hintRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.8')

    // Wait, then fade to next section
    tl.to(
      preloaderRef.current,
      { opacity: 0, duration: 0.8, ease: 'power2.in' },
      '+=2'
    )
  }

  const handleTap = () => {
    gsap.killTweensOf(preloaderRef.current)
    gsap.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete,
    })
  }

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      onClick={handleTap}
      role="status"
      aria-label="Loading your invitation"
    >
      <div className="preloader-hands-wrap">
        <img
          ref={handLeftRef}
          src="/assets/hand animation/hand left.png"
          alt="Bride's hand"
          className="preloader-hand preloader-hand-left"
        />

        <div ref={roseWrapRef} className="preloader-rose-wrap">
          <div className="preloader-rose" aria-hidden="true">
            🌹
          </div>
        </div>

        <img
          ref={handRightRef}
          src="/assets/hand animation/hand right.png"
          alt="Groom's hand"
          className="preloader-hand preloader-hand-right"
        />
      </div>

      <div ref={hintRef} className="preloader-hint" aria-hidden="true">
        <p>Touch to continue</p>
      </div>
    </div>
  )
}

export default Preloader
