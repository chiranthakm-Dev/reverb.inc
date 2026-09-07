import { useEffect, useRef, useState } from 'react'
import { faqs, languages, services } from './data/site.js'

function SectionLabel({ number, children }) {
  return <h2 className="section-label"><i>{number}</i><span>{children}</span></h2>
}

function LanguageFormation() {
  return <div className="formation" aria-hidden="true">
    {languages.concat([['English', ''], ['French', 'Français'], ['Arabic', 'العربية'], ['Japanese', '日本語']]).map(([name, native], index) => {
      const angle = (index / 16) * Math.PI * 2
      const radius = index % 2 ? 44 : 35
      return <span key={name} style={{ '--x': `${Math.cos(angle) * radius}%`, '--y': `${Math.sin(angle) * radius}%`, '--delay': `${index * 70}ms` }}>{name}{native && ` · ${native}`}</span>
    })}
    <div className="formation-logo"><strong>R</strong><b>REVERB</b></div>
  </div>
}

function AudioReel() {
  return <section className="section" id="work"><SectionLabel number="03">Hear the work</SectionLabel>
    <div className="section-heading"><h3>Native voices.<br/><em>Real resonance.</em></h3><p>Selected samples will appear here as Reverb’s cleared audio library is added.</p></div>
    <div className="audio-grid">
      {['Kannada · ಕನ್ನಡ', 'Hindi · हिन्दी', 'Telugu · తెలుగు', 'Tamil · தமிழ்'].map((language, index) => <article className="audio-card" key={language}>
        <span>0{index + 1} / Demo reel</span><h4>{language}</h4><button type="button" disabled aria-label={`${language} sample coming soon`}><i>▶</i><span>Sample pending</span></button>
      </article>)}
    </div>
  </section>
}

const initialForm = { name: '', email: '', company: '', service: '', languages: '', timeline: '', budget: '', scope: '', website: '' }

function Enquiry({ selectedService, onSelect }) {
  const [form, setForm] = useState(initialForm)
  const [state, setState] = useState({ status: 'idle', message: '' })
  const update = event => {
    if (event.target.name === 'service') onSelect('')
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  const submit = async event => {
    event.preventDefault(); setState({ status: 'loading', message: 'Sending…' })
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, service: selectedService || form.service }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry.')
      setState({ status: 'success', message: result.message }); setForm(initialForm); onSelect('')
    } catch (error) { setState({ status: 'error', message: error.message }) }
  }
  return <section className="section enquiry" id="enquiry"><SectionLabel number="06">Start a project</SectionLabel>
    <div className="section-heading"><h3>Tell us what<br/><em>you’re making.</em></h3><p>Share the essentials. The team will reply with the right approach, talent, and next steps.</p></div>
    <form onSubmit={submit} className="form-grid">
      <input className="honeypot" name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" aria-hidden="true" />
      <Field label="Name" required><input name="name" value={form.name} onChange={update} required autoComplete="name" /></Field>
      <Field label="Email" required><input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" /></Field>
      <Field label="Company"><input name="company" value={form.company} onChange={update} autoComplete="organization" /></Field>
      <Field label="Service" required><select name="service" value={selectedService || form.service} onChange={update} required><option value="">Choose a service</option>{services.map(item => <option key={item.title}>{item.title}</option>)}<option>Other</option></select></Field>
      <Field label="Languages" required><input name="languages" value={form.languages} onChange={update} required placeholder="Kannada, Hindi, Telugu…" /></Field>
      <Field label="Timeline"><input name="timeline" value={form.timeline} onChange={update} placeholder="When do you need it?" /></Field>
      <Field label="Budget"><select name="budget" value={form.budget} onChange={update}><option value="">Not decided</option><option>Under ₹50,000</option><option>₹50,000–₹1,00,000</option><option>₹1,00,000–₹5,00,000</option><option>₹5,00,000+</option></select></Field>
      <Field label="Project scope" required wide><textarea name="scope" value={form.scope} onChange={update} required placeholder="Duration, asset count, audience, references, and deliverables" /></Field>
      <div className="form-action"><button disabled={state.status === 'loading'}>{state.status === 'loading' ? 'Sending…' : 'Send enquiry →'}</button><p role="status" className={state.status}>{state.message}</p></div>
    </form>
  </section>
}

function Field({ label, required, wide, children }) { return <label className={wide ? 'field wide' : 'field'}><span>{label}{required && ' *'}</span>{children}</label> }

export default function App() {
  const [service, setService] = useState('')
  const observer = useRef(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    observer.current = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .12 })
    document.querySelectorAll('.section, footer').forEach(node => observer.current.observe(node))
    return () => observer.current?.disconnect()
  }, [])
  const enquire = title => { setService(title); requestAnimationFrame(() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })) }
  return <>
    <div className="ambient"/><header><a className="brand" href="#top"><strong>R</strong><span>REVERB</span></a><nav><a href="#services">Services</a><a href="#work">Work</a><a href="#enquiry">Enquire</a></nav></header>
    <main id="top">
      <section className="hero"><div><small>REVERB INC. · BENGALURU, INDIA</small><h1>The world has <em>stories</em> to tell. We help everyone hear—and see—them in the language they call <em>their own.</em></h1><p>A language and content studio built on voice, craft, and a native understanding of every audience.</p><button onClick={() => enquire('')}>Start a project →</button></div><LanguageFormation /></section>
      <section className="section studio"><SectionLabel number="01">The studio</SectionLabel><div className="studio-grid"><h3>Not just translated.<br/><em>Truly understood.</em></h3><div><p>REVERB Inc. is a Bengaluru-based language and content studio founded by Badekkila Pradeep—a multilingual voice artist, producer, and media professional with two decades across voice, screen, and storytelling.</p><div className="stats"><b>1000+<small>Projects</small></b><b>22+<small>Languages</small></b><b>20<sup>yrs</sup><small>Craft</small></b></div></div></div></section>
      <section className="section" id="services"><SectionLabel number="02">Our services</SectionLabel><div className="service-list">{services.map((item, index) => <article key={item.title}><i>0{index + 1}</i><h3>{item.title}</h3><p>{item.description}</p><button onClick={() => enquire(item.title)}>Enquire →</button></article>)}</div></section>
      <AudioReel />
      <section className="section"><SectionLabel number="04">Languages</SectionLabel><div className="section-heading"><h3>Many languages.<br/><em>One human truth.</em></h3></div><div className="language-grid">{languages.map(([name, native]) => <span key={name}>{name}<em>{native}</em></span>)}</div></section>
      <section className="section"><SectionLabel number="05">Questions</SectionLabel><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
      <Enquiry selectedService={service} onSelect={setService} />
    </main>
    <footer><div><h2>Reverb<span>.</span></h2><p>Root. <em>Resonate.</em> Reach.</p></div><div><a href="mailto:hello@wereverb.com">hello@wereverb.com</a><p>Bengaluru · India</p><small>© 2026 REVERB Inc.</small></div></footer>
  </>
}
