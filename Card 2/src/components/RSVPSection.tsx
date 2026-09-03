import React from 'react'
import './RSVPSection.css'

const RSVPSection: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    guests: '1',
    dietaryRestrictions: 'none',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('RSVP submitted:', formData)
    alert('Thank you for RSVPing! We look forward to celebrating with you.')
    setFormData({ name: '', email: '', guests: '1', dietaryRestrictions: 'none' })
  }

  return (
    <section id="rsvp-section" className="rsvp-section" aria-label="RSVP">
      <div className="section-head">
        <p className="eyebrow">With Great Joy</p>
        <div className="gold-rule"></div>
        <h2 className="display-title">RSVP</h2>
        <p className="tagline">Your presence would make our joy complete.</p>
      </div>

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="form-select"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>

        <div className="form-group">
          <select
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            className="form-select"
          >
            <option value="none">No dietary restrictions</option>
            <option value="veg">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten">Gluten-free</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Confirm RSVP
        </button>
      </form>

      <p className="rsvp-contact">Questions? Reach us at hello@thehvstory.in</p>
    </section>
  )
}

export default RSVPSection
