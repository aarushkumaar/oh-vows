import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './EventStamps.css'

gsap.registerPlugin(ScrollTrigger)

interface Event {
  id: string
  label: string
  date: string
  time: string
  location: string
  color: string
}

const EventStamps: React.FC = () => {
  const events: Event[] = [
    {
      id: 'engagement',
      label: 'Engagement Cocktail',
      date: 'Friday, 18 Sept',
      time: '7:00 PM',
      location: 'Badshapur, Gurgaon',
      color: '#DFB76C',
    },
    {
      id: 'haldi',
      label: 'Haldi Carnival',
      date: 'Sunday, 20 Sept',
      time: '12:00 PM',
      location: 'Badshapur, Gurgaon',
      color: '#E8B8C5',
    },
    {
      id: 'wedding',
      label: 'Wedding Pheras',
      date: 'Monday, 21 Sept',
      time: '8:30 PM',
      location: 'Badshapur, Gurgaon',
      color: '#DFB76C',
    },
  ]

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stamps = containerRef.current?.querySelectorAll('.stamp-card')
    if (!stamps?.length) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      stamps.forEach((el) => {
        ;(el as HTMLElement).style.opacity = '1'
      })
      return
    }

    stamps.forEach((stamp, i) => {
      gsap.fromTo(
        stamp,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      )
    })
  }, [])

  return (
    <section id="event-stamps" className="event-stamps" aria-label="Events">
      <div className="stamps-container" ref={containerRef}>
        {events.map((event) => (
          <div key={event.id} className="stamp-card" style={{ '--stamp-color': event.color } as React.CSSProperties}>
            <div className="stamp-scalloped">
              <div className="stamp-content">
                <h3 className="stamp-label">{event.label}</h3>
                <div className="stamp-divider"></div>
                <p className="stamp-date">{event.date}</p>
                <p className="stamp-time">{event.time}</p>
                <p className="stamp-location">{event.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EventStamps
