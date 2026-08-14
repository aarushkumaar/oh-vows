/**
 * Events & Content Module
 * Centralized data, dollhouse invitations, modal detail view routing, RSVP, wardrobe planner, and things to know
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     EVENT DATA
  ────────────────────────────────────────── */
  const EVENTS = [
    {
      id:          'engagement-cocktail',
      label:       'Engagement Cocktail',
      file:        'engagement-cocktail.png',
      date:        'Friday, 18 September 2026',
      shortDate:   '18 Sept',
      time:        '7:00 PM Onwards',
      location:    'The Grand Palace Lawns',
      locationSub: 'New Delhi, India',
      mapsUrl:     'https://maps.google.com/?q=The+Grand+Palace+Lawns+New+Delhi',
      dressCode:   'Glitz and glam indo-western',
      tagline:     'Where two worlds came together under golden skies.',
      story:       'An evening of laughter, light, and the first toast to forever. As dusk settles over the garden and fairy lights begin to shimmer, two families become one.',
      bgColor:     '#100500',
    },
    {
      id:          'haldi-carnival',
      label:       'Haldi Carnival',
      file:        'haldi-carnival.png',
      date:        'Saturday, 19 September 2026',
      shortDate:   '19 Sept',
      time:        '10:00 AM Onwards',
      location:    'The Heritage Gardens',
      locationSub: 'New Delhi, India',
      mapsUrl:     'https://maps.google.com/?q=The+Heritage+Gardens+New+Delhi',
      dressCode:   'Shades of pastel with mirrors',
      tagline:     'Colour, laughter, and the blessing of a thousand flowers.',
      story:       'Come dressed in the colour of sunshine and blessings. A morning of pure joy — where turmeric, flowers, and family music paint the air gold.',
      bgColor:     '#0E0B00',
    },
    {
      id:          'krishan-sandhya',
      label:       'Ek Shaam Kanha ke Naam',
      subtitle:    'An evening of divine connection',
      file:        'krishan-sandhya.png',
      date:        'Sunday, 6 September 2026',
      shortDate:   '6 Sept',
      time:        '7:00 PM Onwards',
      location:    'The Palace Amphitheatre',
      locationSub: 'New Delhi, India',
      mapsUrl:     'https://maps.google.com/?q=The+Palace+Amphitheatre+New+Delhi',
      dressCode:   'Peacock Blues & Forest Greens',
      tagline:     'An evening of divine connection',
      story:       'A spiritual celebration filled with bhajans, lights, and the energy of pure devotion. Come with an open heart and be swept away by the divine.',
      bgColor:     '#001008',
    },
    {
      id:          'mata-ki-chowki',
      label:       'Mata Ki Chowki',
      file:        'mata-ki-chowki.png',
      date:        'Sunday, 20 September 2026',
      shortDate:   '20 Sept',
      time:        '7:00 PM Onwards',
      location:    'The Grand Palace, Main Hall',
      locationSub: 'New Delhi, India',
      mapsUrl:     'https://maps.google.com/?q=The+Grand+Palace+Main+Hall+New+Delhi',
      dressCode:   'Red & Orange — Traditional Ethnic',
      tagline:     'An Evening of Divine Blessings',
      story:       'A sacred evening of kirtan and prayer to seek the blessings of the divine for the union ahead. Come with reverence and leave with grace.',
      bgColor:     '#100000',
    },
    {
      id:          'wedding',
      label:       'The Wedding',
      file:        'wedding.png',
      date:        'Monday, 21 September 2026',
      shortDate:   '21 Sept',
      time:        '11:00 AM',
      location:    'The Grand Palace',
      locationSub: 'New Delhi, India',
      mapsUrl:     'https://maps.google.com/?q=The+Grand+Palace+New+Delhi',
      dressCode:   'Grand Indian Traditionals',
      tagline:     'The moment everything was always leading to.',
      story:       'Under the mandap, with fire as witness and family as shelter, Vartika and Hardik become forever. Come dressed in your finest and carry your joy.',
      bgColor:     '#080200',
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
      card.innerHTML = `
        <div class="dollhouse-card-img-wrap">
          <img src="assets/images/events/${ev.file}" alt="${ev.label}" loading="lazy" />
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
     EVENT DETAIL VIEW & ROUTING
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

    window.scrollTo(0, mainSiteScrollY);

    setTimeout(() => {
      if (!eventDetailView.classList.contains('is-active')) {
        eventDetailContent.innerHTML = '';
      }
    }, 500);
  }

  function buildEventDetail(ev) {
    const nextEv = getNextEvent(ev.id);

    eventDetailContent.innerHTML = `
      <!-- Hero -->
      <div class="event-hero" style="background:${ev.bgColor};">
        <img class="event-hero-img"
             src="assets/images/events/${ev.file}"
             alt="${ev.label}" />
        <div class="event-hero-grad"></div>
        <div class="event-hero-text">
          <p class="ev-eyebrow" id="ev-eyebrow">The Celebrations</p>
          <div class="ev-gold-rule"></div>
          <h2 class="ev-title" id="ev-title">${ev.label}</h2>
          <p class="ev-tagline" id="ev-tagline">${ev.tagline}</p>
        </div>
      </div>

      <!-- Story & Details -->
      <div style="background:${ev.bgColor}; position:relative; z-index:2;">

        <div class="ev-chapter">
          <div class="ev-gold-rule" style="margin-bottom:clamp(24px,4vh,48px);"></div>
          <p class="ev-story" id="ev-story">${ev.story}</p>
          <div class="ev-gold-rule" style="margin-top:clamp(24px,4vh,48px);"></div>
        </div>

        <!-- Details Grid -->
        <div class="ev-details-row" id="ev-details">
          <div class="ev-detail-item">
            <div class="ev-detail-icon" aria-hidden="true">📅</div>
            <div class="ev-detail-label">Date</div>
            <div class="ev-detail-value">${ev.date}</div>
          </div>
          <div class="ev-detail-item">
            <div class="ev-detail-icon" aria-hidden="true">🕐</div>
            <div class="ev-detail-label">Time</div>
            <div class="ev-detail-value">${ev.time}</div>
          </div>
          <div class="ev-detail-item">
            <div class="ev-detail-icon" aria-hidden="true">📍</div>
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

        <!-- Dress Code -->
        <div class="ev-dresscode-wrap">
          <span class="ev-dresscode-label">Dress Code</span>
          <div class="ev-dresscode-tag" id="ev-dresscode">
            <span aria-hidden="true">👗</span>
            <span>${ev.dressCode}</span>
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
      const eyebrow = document.getElementById('ev-eyebrow');
      const title   = document.getElementById('ev-title');
      const tagline = document.getElementById('ev-tagline');
      gsap.fromTo([eyebrow, title, tagline],
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.88, stagger: 0.14, ease: 'power3.out', delay: 0.25 }
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
              { opacity: 0 },
              { opacity: 1, duration: 0.6, delay: 0.36 }
            );
          }
          detailObs.disconnect();
        }
      }, { threshold: 0.15, root: eventDetailView });
      detailItems.forEach(el => detailObs.observe(el));
      evDetailObservers.push(detailObs);
    } else {
      document.querySelectorAll(
        '.ev-eyebrow, .ev-title, .ev-tagline, .ev-story, .ev-detail-item, .ev-dresscode-tag'
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
      returnBtn.addEventListener('click', () => history.back());
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
    tl.to(eventTransition, { opacity: 1, duration: 0.48, ease: 'power2.inOut' })
      .call(() => {
        evDetailObservers.forEach(obs => obs.disconnect());
        evDetailObservers = [];
        history.pushState({ eventId: nextId }, nextEv.label, '#' + nextId);
        currentEventId = nextId;
        buildEventDetail(nextEv);
        eventDetailView.scrollTop = 0;
      })
      .to(eventTransition, { opacity: 0, duration: 0.65, ease: 'power2.out' }, '+=0.08');
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
    eventBackBtn.addEventListener('click', () => { history.back(); });
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
    buildDollhouseCards,
    initDollhouseAnimation,
    openEvent,
    closeEvent,
    buildThings,
    initThingsAnimation,
    initWardrobeAnimation,
    initRSVP,
    handleInitialHash,
  };
})();
