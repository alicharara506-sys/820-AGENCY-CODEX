'use client';

import { useEffect, useRef, useState } from 'react';
import AlgoVisual from '@/components/algo/algo-visual';
import { AlgoProvider, type AlgoState, useAlgo } from '@/components/algo/algo-controller';

const disciplines: { name: string; number: string; purpose: string; state: AlgoState; services: string[] }[] = [
  { name: 'Brand', number: '01', purpose: 'We define the identity.', state: 'creative', services: ['Brand Strategy', 'Brand Positioning', 'Naming', 'Visual Identity', 'Brand Guidelines', 'Creative Direction', 'Packaging'] },
  { name: 'Digital', number: '02', purpose: 'We create attention and communication.', state: 'communicating', services: ['Digital Strategy', 'Social Media', 'Content Creation', 'Campaigns', 'Advertising Creative', 'Motion Content', 'Growth Marketing'] },
  { name: 'Technology', number: '03', purpose: 'We build the experience and infrastructure.', state: 'building', services: ['Websites', 'E-commerce', 'UI/UX', 'Interactive Experiences', '3D Websites', 'Web Applications', 'SaaS', 'Custom Software', 'APIs and Integrations'] },
  { name: 'AI', number: '04', purpose: 'We make systems intelligent.', state: 'thinking', services: ['AI Applications', 'AI Agents', 'Workflow Automation', 'AI Integration', 'Customer Automation', 'Process Automation', 'Multi-Agent Systems'] },
  { name: 'Analytics', number: '05', purpose: 'We turn data into decisions.', state: 'analyzing', services: ['Business Analytics', 'KPI Tracking', 'Performance Dashboards', 'Sales Analytics', 'Marketing Analytics', 'Customer Analytics', 'Operational Analytics', 'Forecasting', 'Automated Reporting', 'AI-Powered Insights'] },
];

const process = [
  ['Discover', 'Observe the real problem, people, and context.'],
  ['Strategize', 'Define the system, priorities, and path forward.'],
  ['Create', 'Give the idea language, identity, and form.'],
  ['Build', 'Turn the concept into a working experience.'],
  ['Launch', 'Release with clarity, readiness, and intent.'],
  ['Analyze', 'Read the signals and understand performance.'],
  ['Grow', 'Evolve the system through evidence and learning.'],
];

const reasons = [
  ['01', 'One connected system', 'Strategy and execution live under one roof, so the thinking survives the journey into the work.'],
  ['02', 'Creative technology', 'Creativity is supported by technology—and technology is shaped by brand thinking.'],
  ['03', 'Useful intelligence', 'AI connects to practical workflows. Analytics connects to decisions people can act on.'],
  ['04', 'Built to evolve', 'Every system is designed to learn, adapt, and support sustainable growth.'],
];

function Opening({ onDone }: { onDone: () => void }) {
  return (
    <div className="opening" role="dialog" aria-label="820 Agency introduction">
      <button className="skip" onClick={onDone}>Skip intro</button>
      <div className="boot-eyes"><i /><i /></div>
      <p className="boot-brand">820 AGENCY</p>
      <p className="boot-disciplines">BRAND × DIGITAL × TECHNOLOGY × AI × ANALYTICS</p>
      <p className="boot-line">WE BUILD THE ALGORITHM BEHIND GROWTH.</p>
    </div>
  );
}

function Experience() {
  const { controller, setDiscipline, setPointer, setState } = useAlgo();
  const [intro, setIntro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProcess, setActiveProcess] = useState(0);
  const [formState, setFormState] = useState<'idle' | 'error' | 'success'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const played = sessionStorage.getItem('820-intro-played');
    if (!reduced && !played) {
      setIntro(true);
      const timer = window.setTimeout(() => { sessionStorage.setItem('820-intro-played', '1'); setIntro(false); }, 3600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth * 2 - 1;
      const y = event.clientY / window.innerHeight * 2 - 1;
      setPointer(x, y);
      if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [setPointer]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const state = visible?.target.getAttribute('data-algo') as AlgoState | null;
      if (state) setState(state);
    }, { threshold: [0.35, 0.6] });
    document.querySelectorAll('[data-algo]').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [setState]);

  const endIntro = () => { sessionStorage.setItem('820-intro-played', '1'); setIntro(false); };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!String(data.get('name') || '').trim()) nextErrors.name = 'Tell us what to call you.';
    const email = String(data.get('email') || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (String(data.get('brief') || '').trim().length < 20) nextErrors.brief = 'Share at least 20 characters about the problem.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setFormState('error'); setState('focused'); return; }
    setFormState('success');
    setState('success');
  };

  return (
    <>
      {intro && <Opening onDone={endIntro} />}
      <div ref={cursor} className="custom-cursor" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="820 Agency home">820</a>
        <p>Creative technology agency</p>
        <nav aria-label="Primary navigation" className={menuOpen ? 'is-open' : ''}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a className="header-cta" href="#contact" onClick={() => setMenuOpen(false)}>Start a project <span aria-hidden="true">↗</span></a>
        </nav>
        <button className="menu-button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? 'Close' : 'Menu'}</button>
      </header>

      <main>
        <section className="hero" id="top" data-algo="awake">
          <div className="hero-copy reveal">
            <p className="eyebrow">Brand × Digital × Technology × AI × Analytics</p>
            <h1>We build the<br />algorithm<br />behind <em>growth.</em></h1>
            <div className="hero-bottom">
              <p>820 is a creative technology agency building brands, digital experiences, intelligent systems, and data-driven growth engines.</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#contact" onMouseEnter={() => setState('happy')} onMouseLeave={() => setState('awake')}>Start a project <span aria-hidden="true">→</span></a>
                <a className="button button-light" href="#about">Explore 820 <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
          <div className="hero-algo"><AlgoVisual variant="hero" /><p className="fallback-label">APPROVED IMAGE FALLBACK · 3D PIPELINE READY</p></div>
          <p className="section-index">820—01 / SYSTEM ONLINE</p>
        </section>

        <section className="manifesto dark-section" aria-label="820 philosophy" data-algo="curious">
          <p className="section-kicker">The growth equation</p>
          <p className="manifesto-line">BRAND gives it meaning.</p>
          <p className="manifesto-line">DIGITAL gives it reach.</p>
          <p className="manifesto-line">TECHNOLOGY gives it form.</p>
          <p className="manifesto-line"><span>AI gives it intelligence.</span></p>
          <p className="manifesto-line">ANALYTICS gives it direction.</p>
          <div className="equation" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </section>

        <section className="about section-grid" id="about" data-algo="thinking">
          <div className="section-label"><span>02</span><p>About 820</p></div>
          <div className="about-copy">
            <h2>We connect the parts that modern growth keeps separating.</h2>
            <div className="about-columns">
              <p>820 combines brand thinking, digital communication, technology, artificial intelligence, and analytics to build complete systems for modern businesses.</p>
              <p className="origin"><b>WHY 820?</b>The name quietly nods to Al-Khwarizmi’s foundational work and the long story behind algorithms. Our focus is firmly forward: intelligent systems, transformed into useful growth.</p>
            </div>
          </div>
        </section>

        <section className="disciplines" id="services" data-algo={disciplines.find((item) => item.name === controller.activeDiscipline)?.state ?? 'creative'}>
          <div className="disciplines-head section-grid">
            <div className="section-label"><span>03</span><p>What we build</p></div>
            <h2>Five disciplines.<br /><em>One growth system.</em></h2>
          </div>
          <div className="discipline-world">
            <div className="discipline-list" role="tablist" aria-label="820 disciplines">
              {disciplines.map((item) => (
                <button key={item.name} role="tab" aria-selected={controller.activeDiscipline === item.name} onClick={() => setDiscipline(item.name, item.state)}>
                  <span>{item.number}</span>{item.name}<i aria-hidden="true">↗</i>
                </button>
              ))}
            </div>
            <div className="world-stage">
              <AlgoVisual />
              <div className="world-grid" aria-hidden="true" />
              <div className="data-card data-card-a" aria-hidden="true">INPUT<br /><b>CREATIVITY</b></div>
              <div className="data-card data-card-b" aria-hidden="true">OUTPUT<br /><b>GROWTH</b></div>
            </div>
            <div className="discipline-detail" role="tabpanel">
              {disciplines.filter((item) => item.name === controller.activeDiscipline).map((item) => (
                <div key={item.name}>
                  <p className="detail-mode">ALGO / {item.state.toUpperCase()} MODE</p>
                  <h3>{item.purpose}</h3>
                  <ul>{item.services.map((service) => <li key={service}>{service}<span aria-hidden="true">+</span></li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="work section-grid" id="work" data-algo="focused">
          <div className="section-label"><span>04</span><p>Selected work</p></div>
          <div>
            <div className="work-heading"><h2>Proof belongs<br />in the work.</h2><p>Real case studies will appear here when owner-approved project content is available.</p></div>
            <div className="projects">
              {[
                ['Project 01', 'Brand × Digital', 'Editorial project space'],
                ['Project 02', 'Technology × AI', 'Interactive project space'],
                ['Project 03', 'Analytics', 'Intelligence project space'],
              ].map((project, index) => (
                <article className={`project project-${index + 1}`} key={project[0]}>
                  <div className="project-art" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><i /><i /></div>
                  <div className="project-meta"><span>Editable placeholder</span><span>Year pending</span></div>
                  <h3>{project[0]}</h3><p>{project[1]}</p><strong>{project[2]}</strong>
                  <button type="button" disabled title="Add an owner-approved case study to enable">Case study pending <span aria-hidden="true">↗</span></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process dark-section" data-algo="building">
          <div className="process-top"><div className="section-label"><span>05</span><p>How we move</p></div><h2>From unknown<br />to undeniable.</h2></div>
          <div className="process-system">
            <div className="process-list" role="list">
              {process.map(([name], index) => <button key={name} className={activeProcess === index ? 'active' : ''} onClick={() => { setActiveProcess(index); setState((['curious', 'thinking', 'creative', 'building', 'communicating', 'analyzing', 'happy'] as AlgoState[])[index]); }}><span>0{index + 1}</span>{name}</button>)}
            </div>
            <div className="process-display">
              <span className="process-number">0{activeProcess + 1}</span>
              <h3>{process[activeProcess][0]}</h3>
              <p>{process[activeProcess][1]}</p>
              <div className="process-orbit" aria-hidden="true"><i /><i /><i /></div>
            </div>
          </div>
        </section>

        <section className="why section-grid" data-algo="analyzing">
          <div className="section-label"><span>06</span><p>Why 820</p></div>
          <div><h2>A system is only smart<br />when everything connects.</h2><div className="reason-grid">{reasons.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div>
        </section>

        <section className="contact" id="contact" data-algo="happy">
          <div className="contact-copy"><p className="section-kicker">Start the conversation</p><h2>Got a problem<br />worth <em>solving?</em></h2><p className="contact-tagline">LET’S BUILD THE ALGORITHM.</p><AlgoVisual variant="contact" /></div>
          <form className="contact-form" onSubmit={submit} noValidate>
            <p className="form-note">Project brief preview · Delivery destination pending owner configuration.</p>
            <label>What should we call you?<input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Your name" />{errors.name && <span id="name-error">{errors.name}</span>}</label>
            <label>Where can we reach you?<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} placeholder="you@company.com" />{errors.email && <span id="email-error">{errors.email}</span>}</label>
            <label>What problem is worth solving?<textarea name="brief" rows={4} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? 'brief-error' : undefined} placeholder="Tell us about the ambition, challenge, or opportunity." />{errors.brief && <span id="brief-error">{errors.brief}</span>}</label>
            <label>Where should we begin?<select name="discipline" defaultValue=""><option value="" disabled>Select a focus</option>{disciplines.map((item) => <option key={item.name}>{item.name}</option>)}<option>Not sure yet</option></select></label>
            <button className="submit-button" type="submit">Prepare project brief <span aria-hidden="true">→</span></button>
            <p className={`form-status ${formState}`} role="status">{formState === 'success' ? 'Your brief is ready. Connect the owner-approved contact destination to enable delivery.' : formState === 'error' ? 'A few details need your attention.' : 'Your information is not transmitted in this preview.'}</p>
          </form>
        </section>
      </main>

      <footer>
        <a className="footer-brand" href="#top">820</a>
        <p>Creative technology agency</p>
        <p>Brand × Digital × Technology × AI × Analytics</p>
        <a href="#top">Back to top ↑</a>
        <small>© {new Date().getFullYear()} 820 Agency. Owner contact and social links pending.</small>
      </footer>
    </>
  );
}

export default function HomeExperience() {
  return <AlgoProvider><Experience /></AlgoProvider>;
}
