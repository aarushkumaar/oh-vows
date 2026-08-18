/**
 * Events & Content Module
 * Centralized event data, dynamic background mapping, dollhouse invitations,
 * modal detail view routing, RSVP, wardrobe planner, things to know, and infinite carousel
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     EVENT DATA & THEMATIC BACKGROUND MAPPING
  ────────────────────────────────────────── */
  const EVENTS = [
    {
      id:          'engagement-cocktail',
      label:       'Sagan Engagement - The Glitz Noir',
      file:        'engagement-cocktail.png',
      background:  'assets/images/backgrounds/cocktail-bg.png',
      date:        'Friday, 18 September 2026',
      shortDate:   '18 Sept',
      time:        '7:00 PM Onwards',
      location:    'TNTB Hall, Omnia Convention by Tivoli',
      locationSub: 'Badshapur, Gurgaon-122102',
      mapsUrl:     'https://maps.app.goo.gl/Yx8hiEeq23txVzKZ6?g_st=ic',
      dressCode: {
        title: 'Glitz and glam indo-western',
        note: 'Shimmering metallic accents, sophisticated evening silhouettes',
        colors: [
          { name: 'Royal Gold', hex: '#DFB76C' },
          { name: 'Champagne', hex: '#F3DFA2' },
          { name: 'Midnight', hex: '#1A0A00' }
        ]
      },
      tagline:     'Where two worlds came together under golden skies.',
      story:       'An evening of laughter, light, and the first toast to forever. As dusk settles over the garden and fairy lights begin to shimmer, two families become one.',
      bgColor:     '#100500',
    },
    {
      id:          'haldi-carnival',
      label:       'Pastel Rave',
      file:        'haldi-carnival.png',
      background:  'assets/images/backgrounds/yellow-bg.png',
      date:        'Sunday, 19 September 2026',
      shortDate:   '20 Sept',
      time:        '12:00 PM Onwards',
      location:    'Pool Side Deck, Omnia Convention by Tivoli',
      locationSub: 'Badshapur, Gurgaon-122102',
      mapsUrl:     'https://maps.app.goo.gl/Yx8hiEeq23txVzKZ6?g_st=ic',
      dressCode: {
        title: 'Shades of pastel with mirrors',
        note: 'Fresh morning pastels, (Avoid yellow)',
        colors: [
          { name: 'Blush Pink', hex: '#E8B8C5' },
          { name: 'Powder Blue', hex: '#AFC9DF' },
          { name: 'Pistachio Mist', hex: '#C8D8C0' }
        ]
      },
      tagline:     'Colour, laughter, and the blessing of a thousand flowers.',
      story:       'Come dressed in the colour of sunshine and blessings. A morning of pure joy — where turmeric, flowers, and family music paint the air gold.',
      bgColor:     '#1A1400',
    },
    {
      id:          'wedding',
      label:       'Pheras of forever',
      file:        'wedding.png',
      background:  'assets/images/backgrounds/bg-red.png',
      date:        'Monday, 21 September 2026',
      shortDate:   '21 Sept',
      time:        '6PM Baraat Assembly, 8:30PM Pheraas',
      location:    'GBR Hall, Omnia Convention by Tivoli',
      locationSub: 'Badshapur, Gurgaon-122102',
      mapsUrl:     'https://maps.app.goo.gl/Yx8hiEeq23txVzKZ6?g_st=ic',
      dressCode: {
        title: 'Grand Indian Traditionals',
        note: 'Regal royal attire, classic heavy weaves & heirloom elegance',
        colors: [
          { name: 'Royal Crimson', hex: '#700913' },
          { name: 'Heirloom Gold', hex: '#DFB76C' },
          { name: 'Raw Silk Cream', hex: '#FAF6EE' }
        ]
      },
      tagline:     'The moment everything was always leading to.',
      story:       'Under the mandap, with fire as witness and family as shelter, Vartika and Hardik become forever. Come dressed in your finest and carry your joy.',
      bgColor:     '#0D0200',
    },
  ];


  /* ──────────────────────────────────────────
     DOM REFERENCES
  ────────────────────────────────────────── */
  const mainSite           = document.getElementById('main-site');
  const eventDetailView    = document.getElementById('event-detail-view');
  const eventDetailContent = document.getElementById('event-detail-content');
  const eventBackBtn       = document.getElementById('event-back-btn');
  const eventTransition    = document.getElementById('event-transition');

  let currentEventId       = null;
  let mainSiteScrollY      = 0;
  let evDetailObservers     = [];

  function getEvent(id) {
    return EVENTS.find(e => e.id === id) || null;
  }

  function getNextEvent(id) {
    const idx = EVENTS.findIndex(e => e.id === id);
    return idx >= 0 && idx < EVENTS.length - 1 ? EVENTS[idx + 1] : null;
  }

  /* ──────────────────────────────────────────
     BUILD DOLLHOUSE CARDS
  ────────────────────────────────────────── */
  function buildDollhouseCards() {
    const container = document.getElementById('dollhouse-cards');
    if (!container) return;
    container.innerHTML = '';
    EVENTS.forEach((ev) => {
      const card = document.createElement('div');
      card.className = 'dollhouse-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Open ${ev.label} details`);
      card.dataset.eventId = ev.id;
      const thumbFile = ev.file.replace(/\.png$/i, '.webp');
      card.innerHTML = `
        <div class="dollhouse-card-img-wrap">
          <img class="progressive-img"
               src="assets/images/thumbs/${thumbFile}"
               data-full="assets/images/events/${ev.file}"
               alt="${ev.label}"
               loading="lazy"
               decoding="async" />
        </div>
      `;
      card.addEventListener('click', () => openEvent(ev.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEvent(ev.id);
        }
      });
      container.appendChild(card);
    });
  }

  function initDollhouseAnimation() {
    const cards = document.querySelectorAll('.dollhouse-card');
    if (!cards.length || prefersReduced) {
      cards.forEach(el => { el.style.opacity = '1'; });
      return;
    }
    gsap.fromTo(Array.from(cards),
      { opacity: 0, y: 50, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.95, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#dollhouse-section', start: 'top 72%' }
      }
    );
  }

  /* ──────────────────────────────────────────
     EVENT DETAIL VIEW & THEMATIC BACKGROUNDS
  ────────────────────────────────────────── */
  function openEvent(eventId) {
    const ev = getEvent(eventId);
    if (!ev) return;
    mainSiteScrollY = window.scrollY;
    history.pushState({ eventId }, ev.label, '#' + eventId);
    currentEventId = eventId;
    buildEventDetail(ev);
    showEventDetail();
  }

  function showEventDetail() {
    if (!mainSite || !eventDetailView || !eventBackBtn) return;
    mainSite.setAttribute('aria-hidden', 'true');
    mainSite.style.pointerEvents = 'none';
    eventDetailView.classList.add('is-active');
    eventBackBtn.classList.add('is-active');
    eventDetailView.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeEvent() {
    evDetailObservers.forEach(obs => obs.disconnect());
    evDetailObservers = [];

    if (!eventDetailView || !eventBackBtn || !mainSite) return;
    eventDetailView.classList.remove('is-active');
    eventBackBtn.classList.remove('is-active');
    mainSite.removeAttribute('aria-hidden');
    mainSite.style.pointerEvents = '';
    document.body.style.overflow = '';
    currentEventId = null;

    setTimeout(() => {
      if (!eventDetailView.classList.contains('is-active')) {
        eventDetailContent.innerHTML = '';
      }
    }, 500);
  }

  /**
   * Return to Main Index Page and smoothly scroll to Grand Events Section
   */
  function returnToEventsSection() {
    closeEvent();

    if (window.history.replaceState) {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }

    const eventsSection = document.getElementById('dollhouse-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function buildEventDetail(ev) {
    const nextEv = getNextEvent(ev.id);
    const bgUrl = ev.background ? `url('${ev.background}')` : 'none';

    // Apply the configured thematic background directly to the view container
    eventDetailView.style.backgroundImage = bgUrl;
    eventDetailView.style.backgroundColor = ev.bgColor;

    eventDetailContent.innerHTML = `
      <!-- Hero -->
      <div class="event-hero" style="background-image: ${bgUrl}; background-color: ${ev.bgColor};">
        <div class="event-hero-grad"></div>
        <div class="event-hero-artwork-wrap">
          <img class="event-hero-img"
               src="assets/images/events/${ev.file}"
               alt="${ev.label}" />
        </div>
        <div class="event-hero-text">
          <p class="ev-eyebrow" id="ev-eyebrow">The Celebrations</p>
          <div class="ev-gold-rule"></div>
          <h2 class="ev-title" id="ev-title">${ev.label}</h2>
          <p class="ev-tagline" id="ev-tagline">${ev.tagline}</p>
        </div>
      </div>

      <!-- Story & Details Container -->
      <div class="event-detail-body">

        <div class="ev-chapter">
          <div class="ev-gold-rule" style="margin-bottom: clamp(24px, 4vh, 48px);"></div>
          <p class="ev-story" id="ev-story">${ev.story}</p>
          <div class="ev-gold-rule" style="margin-top: clamp(24px, 4vh, 48px);"></div>
        </div>

        <!-- Details Grid -->
        <div class="ev-details-row" id="ev-details">
          <div class="ev-detail-item">
            <div class="ev-detail-icon" aria-hidden="true">
              <img class="ev-icon" src="assets/images/icons/calander-logo.png" alt="" />
            </div>
            <div class="ev-detail-label">Date</div>
            <div class="ev-detail-value">${ev.date}</div>
          </div>
          <div class="ev-detail-item">
            <div class="ev-detail-icon" aria-hidden="true">
              <img class="ev-icon ev-icon--time" src="assets/images/icons/time-logo.png" alt="" />
            </div>
            <div class="ev-detail-label">Time</div>
            <div class="ev-detail-value">${ev.time}</div>
          </div>
          <div class="ev-detail-item">
            <div class="ev-detail-icon" aria-hidden="true">
              <img class="ev-icon ev-icon--venue" src="assets/images/icons/venue-logo.png" alt="" />
            </div>
            <div class="ev-detail-label">Venue</div>
            <div class="ev-detail-value">${ev.location}</div>
            <div class="ev-detail-sub">${ev.locationSub}</div>
            ${ev.mapsUrl ? `
              <a href="${ev.mapsUrl}" target="_blank" rel="noopener noreferrer" class="ev-route-btn" aria-label="View Route to ${ev.location}">
                <span>View Route</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            ` : ''}
          </div>
        </div>

        <!-- Experiential Dress Code & Palette Card -->
        <div class="ev-dresscode-wrap">
          <div class="ev-dresscode-card" id="ev-dresscode">
            <span class="ev-dresscode-label">Dress Code &amp; Palette</span>
            <div class="ev-dresscode-palette">
              ${ev.dressCode.colors.map(c => `
                <div class="ev-palette-swatch-wrap">
                  <span class="ev-palette-swatch" style="background-color: ${c.hex};" title="${c.name}"></span>
                  <span class="ev-palette-name">${c.name}</span>
                </div>
              `).join('')}
            </div>
            <h3 class="ev-dresscode-title">${ev.dressCode.title}</h3>
            <p class="ev-dresscode-note">${ev.dressCode.note}</p>
          </div>
        </div>

        <!-- Next Event / Return -->
        <div class="ev-next-zone">
          ${nextEv ? `
            <span class="ev-next-label">Continue the journey</span>
            <div class="ev-next-title" id="ev-next-btn"
                 role="button" tabindex="0"
                 aria-label="Next: ${nextEv.label}">
              ${nextEv.label} &rarr;
            </div>
          ` : `
            <span class="ev-next-label">The journey is complete</span>
            <button class="ev-return-btn" id="ev-return-btn"
                    aria-label="Return to events overview">
              &larr; Return to Events
            </button>
          `}
        </div>
      </div>
    `;

    if (!prefersReduced) {
      const heroArtwork = eventDetailContent.querySelector('.event-hero-artwork-wrap');
      const eyebrow = document.getElementById('ev-eyebrow');
      const title   = document.getElementById('ev-title');
      const tagline = document.getElementById('ev-tagline');

      if (heroArtwork) {
        gsap.fromTo(heroArtwork,
          { opacity: 0, scale: 0.94, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }
        );
      }

      gsap.fromTo([eyebrow, title, tagline],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out', delay: 0.25 }
      );

      const story = document.getElementById('ev-story');
      if (story) {
        const stObs = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            gsap.fromTo(story,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.78, ease: 'power2.out' }
            );
            stObs.disconnect();
          }
        }, { threshold: 0.25, root: eventDetailView });
        stObs.observe(story);
        evDetailObservers.push(stObs);
      }

      const detailItems = document.querySelectorAll('.ev-detail-item');
      const dresscode   = document.getElementById('ev-dresscode');
      const detailObs = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          gsap.fromTo(Array.from(detailItems),
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.11, ease: 'power2.out' }
          );
          if (dresscode) {
            gsap.fromTo(dresscode,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.75, delay: 0.25, ease: 'power2.out' }
            );
          }
          detailObs.disconnect();
        }
      }, { threshold: 0.15, root: eventDetailView });
      detailItems.forEach(el => detailObs.observe(el));
      if (dresscode) detailObs.observe(dresscode);
      evDetailObservers.push(detailObs);
    } else {
      document.querySelectorAll(
        '.ev-eyebrow, .ev-title, .ev-tagline, .ev-story, .ev-detail-item, .ev-dresscode-card, .event-hero-artwork-wrap'
      ).forEach(el => { el.style.opacity = '1'; });
    }

    const nextBtn   = document.getElementById('ev-next-btn');
    const returnBtn = document.getElementById('ev-return-btn');

    if (nextBtn && nextEv) {
      const goNext = () => transitionToEvent(nextEv.id);
      nextBtn.addEventListener('click', goNext);
      nextBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goNext();
        }
      });
    }
    if (returnBtn) {
      returnBtn.addEventListener('click', returnToEventsSection);
    }
  }

  function transitionToEvent(nextId) {
    const nextEv = getEvent(nextId);
    if (!nextEv) return;

    if (prefersReduced) {
      evDetailObservers.forEach(obs => obs.disconnect());
      evDetailObservers = [];
      history.pushState({ eventId: nextId }, nextEv.label, '#' + nextId);
      currentEventId = nextId;
      buildEventDetail(nextEv);
      eventDetailView.scrollTop = 0;
      return;
    }

    eventTransition.style.background = nextEv.bgColor;

    const tl = gsap.timeline();
    tl.to(eventTransition, { opacity: 1, duration: 0.4, ease: 'power2.inOut' })
      .call(() => {
        evDetailObservers.forEach(obs => obs.disconnect());
        evDetailObservers = [];
        history.pushState({ eventId: nextId }, nextEv.label, '#' + nextId);
        currentEventId = nextId;
        buildEventDetail(nextEv);
        eventDetailView.scrollTop = 0;
      })
      .to(eventTransition, { opacity: 0, duration: 0.55, ease: 'power2.out' }, '+=0.05');
  }

  /* ──────────────────────────────────────────
     THINGS TO KNOW
  ────────────────────────────────────────── */
  const THINGS = [
    { icon: '👗', title: 'Dress Code',     body: 'Formal ethnic or semi-formal attire in warm tones — ivory, blush, gold, or pastels. Avoid black and white.' },
    { icon: '✈️', title: 'Venue & Travel', body: 'All events are held at The Grand Palace, New Delhi. Complimentary shuttle service available from select hotels.' },
    { icon: '🏨', title: 'Accommodation',  body: 'A block of rooms has been reserved at The Heritage Suites. Please use code VARTIKA26 when booking.' },
    { icon: '📞', title: 'Contact',        body: 'For queries, reach out to our event coordinators at +91 98765 43210 or events@ohvows.in' },
  ];

  function buildThings() {
    const grid = document.getElementById('things-grid');
    if (!grid) return;
    grid.innerHTML = '';
    THINGS.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'thing-card';
      card.innerHTML = `
        <div class="thing-icon" aria-hidden="true">${t.icon}</div>
        <h3 class="thing-title">${t.title}</h3>
        <p class="thing-body">${t.body}</p>
      `;
      grid.appendChild(card);
    });
  }

  function initThingsAnimation() {
    const cards = document.querySelectorAll('.thing-card');
    if (!cards.length || prefersReduced) {
      cards.forEach(el => { el.style.opacity = '1'; });
      return;
    }
    gsap.fromTo(Array.from(cards),
      { opacity: 0, y: 38 },
      {
        opacity: 1, y: 0, duration: 0.88, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '#things-section', start: 'top 72%' }
      }
    );
  }

  /* ──────────────────────────────────────────
     WARDROBE PLANNER ANIMATION
  ────────────────────────────────────────── */
  function initWardrobeAnimation() {
    const cards = document.querySelectorAll('.wardrobe-card');
    if (!cards.length || prefersReduced) {
      cards.forEach(el => { el.style.opacity = '1'; });
      return;
    }
    gsap.fromTo(Array.from(cards),
      { opacity: 0, y: 38 },
      {
        opacity: 1, y: 0, duration: 0.88, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '#wardrobe-section', start: 'top 75%' }
      }
    );
  }

  /* ──────────────────────────────────────────
     BRIDE + GROOM INFINITE CAROUSEL (Progressive Thumbnails)
  ────────────────────────────────────────── */
  const CAROUSEL_IMAGES = [
    { thumb: 'assets/images/thumbs/carousel-1.webp', full: 'assets/images/gallery/carousel-1.jpg' },
    { thumb: 'assets/images/thumbs/carousel-2.webp', full: 'assets/images/gallery/carousel-2.jpg' },
    { thumb: 'assets/images/thumbs/carousel-3.webp', full: 'assets/images/gallery/carousel-3.jpg' },
    { thumb: 'assets/images/thumbs/carousel-4.webp', full: 'assets/images/gallery/carousel-4.jpg' },
    { thumb: 'assets/images/thumbs/carousel-5.webp', full: 'assets/images/gallery/carousel-5.jpg' },
    { thumb: 'assets/images/thumbs/carousel-6.webp', full: 'assets/images/gallery/carousel-6.jpg' },
    { thumb: 'assets/images/thumbs/carousel-7.webp', full: 'assets/images/gallery/carousel-7.jpg' },
    { thumb: 'assets/images/thumbs/carousel-8.webp', full: 'assets/images/gallery/carousel-8.jpg' },
  ];

  function buildCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    track.innerHTML = '';
    // Duplicate set for seamless continuous horizontal translation (-50% loop)
    const items = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];
    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.setAttribute('aria-hidden', idx >= CAROUSEL_IMAGES.length ? 'true' : 'false');
      card.innerHTML = `<img class="progressive-img" src="${item.thumb}" data-full="${item.full}" alt="Vartika &amp; Hardik Moment ${((idx % CAROUSEL_IMAGES.length) + 1)}" loading="lazy" decoding="async" />`;
      track.appendChild(card);
    });
  }

  /* ──────────────────────────────────────────
     RSVP INTERACTION
  ────────────────────────────────────────── */
  function initRSVP() {
    const submitBtn = document.getElementById('rsvp-submit');
    if (!submitBtn) return;
    submitBtn.addEventListener('click', () => {
      const name = document.getElementById('rsvp-name')?.value.trim();
      if (!name) {
        alert('Please enter your name.');
        return;
      }
      alert(`Thank you, ${name}! Your response has been noted. \u2736`);
    });
  }

  /* ──────────────────────────────────────────
     ROUTING & HASH HANDLING
  ────────────────────────────────────────── */
  if (eventBackBtn) {
    eventBackBtn.addEventListener('click', returnToEventsSection);
  }

  window.addEventListener('popstate', (e) => {
    if (e.state?.eventId) {
      const ev = getEvent(e.state.eventId);
      if (ev) {
        evDetailObservers.forEach(obs => obs.disconnect());
        evDetailObservers = [];
        currentEventId = e.state.eventId;
        buildEventDetail(ev);
        showEventDetail();
        if (eventDetailView) eventDetailView.scrollTop = 0;
      }
    } else {
      closeEvent();
    }
  });

  function handleInitialHash() {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const ev = getEvent(hash);
      if (ev) openEvent(ev.id);
    }
  }

  window.EventsModule = {
    EVENTS,
    buildDollhouseCards,
    initDollhouseAnimation,
    openEvent,
    closeEvent,
    returnToEventsSection,
    buildCarousel,
    handleInitialHash,
  };
})();
