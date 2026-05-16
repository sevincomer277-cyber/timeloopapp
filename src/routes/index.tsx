import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useState, useEffect, useRef, useMemo, useCallback,
  type ReactNode,
} from 'react'
import {
  Lock, Globe, MessageSquare, Image, Video, Mic,
  ChevronDown, X, Menu, Sun, Moon, ArrowRight,
  Check, Calendar, Shield, Star, Heart, Clock,
  Layers, Sparkles, Mail, Twitter, Github, Instagram,
  Play, Pause, Volume2, FileText, Camera,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

/* ═══════════════════════════════════════════════════════════
   Types & Data
═══════════════════════════════════════════════════════════ */

type Theme = 'dark' | 'light'
type ModalStep = 1 | 2 | 3 | 4
type CapsuleType = 'message' | 'photo' | 'video' | 'voice' | 'mixed'

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number; expired: boolean
}

interface CapsuleData {
  id: string
  title: string
  author: string
  preview: string
  unlockDate: Date
  sealDate: Date
  isPublic: boolean
  type: CapsuleType
  accentColor: string
  emoji: string
}

const CAPSULES: CapsuleData[] = [
  {
    id: '1',
    title: 'A Letter to Future Marcus',
    author: 'Marcus Chen',
    preview: 'By the time you read this, a decade will have passed. I wonder if you still drink your coffee black, if you kept the promises you made that January…',
    unlockDate: new Date('2030-01-01'),
    sealDate: new Date('2024-01-15'),
    isPublic: false,
    type: 'message',
    accentColor: '#c8a96d',
    emoji: '✉',
  },
  {
    id: '2',
    title: 'Our Wedding Day',
    author: 'Priya & Arnav Mehta',
    preview: 'On this day, surrounded by everyone we love, we sealed this moment to revisit together. 147 photos, 3 videos, and a voice note neither of us can listen to without crying.',
    unlockDate: new Date('2026-06-15'),
    sealDate: new Date('2024-06-15'),
    isPublic: false,
    type: 'mixed',
    accentColor: '#6fa3d8',
    emoji: '♥',
  },
  {
    id: '3',
    title: 'Class of 2025 — A Decade On',
    author: 'Eleanor Park',
    preview: 'To the 847 of us who walked across that stage: wherever life took you, I hope it was everything you were afraid to want. Open this on June 1st, 2035.',
    unlockDate: new Date('2035-06-01'),
    sealDate: new Date('2025-06-01'),
    isPublic: true,
    type: 'message',
    accentColor: '#8b7fc4',
    emoji: '✦',
  },
]

const TESTIMONIALS = [
  {
    quote: 'I wrote to my future daughter on the day she was born. When she turns 18, she\'ll read my words from 2024. TimeCapsule made this possible — not just the technology, but the ritual of it.',
    author: 'Seraphine Okoro',
    role: 'Author · Mother of two',
    initial: 'S',
    accent: '#c8a96d',
  },
  {
    quote: 'I sealed a letter to myself for when I turn 40. The act of writing it transformed how I see today. The present became a gift I\'m leaving for my future self.',
    author: 'Kai Tanaka',
    role: 'Software Engineer, age 31',
    initial: 'K',
    accent: '#6fa3d8',
  },
  {
    quote: 'For our anniversary, my husband and I each wrote a capsule we\'ll open on our 25th year together. It\'s romantic in a way nothing else is — a love letter across decades.',
    author: 'Beatrix Novak',
    role: 'Journalist & Essayist',
    initial: 'B',
    accent: '#8b7fc4',
  },
]

const FAQ_ITEMS = [
  {
    q: 'When exactly is my capsule delivered?',
    a: 'Your capsule unlocks at midnight on the date you set, adjusted to the timezone you were in when you created it. You\'ll receive an email notification, and the capsule appears in your dashboard ready to open.',
  },
  {
    q: 'What happens if I forget my account credentials?',
    a: 'We offer email-based recovery, plus a Legacy Key — a printable recovery code you generate when creating high-stakes capsules. We strongly recommend generating a Legacy Key for any capsule set to open years from now.',
  },
  {
    q: 'Can I edit a capsule after sealing it?',
    a: 'No — and that\'s by design. The integrity of the original moment is what gives it meaning. However, you can add a "Postscript" at any time, which is delivered alongside the original without altering it.',
  },
  {
    q: 'Is my content private and secure?',
    a: 'All capsule content is encrypted at rest using AES-256. Private capsules are additionally wrapped with a unique per-user key. Even our team cannot read your sealed capsules. Public capsules reveal their content only after their unlock date.',
  },
  {
    q: 'What if TimeCapsule shuts down before my capsule unlocks?',
    a: 'We maintain a 5-year operational reserve specifically to ensure capsule delivery even in the event of business closure. Legacy plan subscribers also receive a downloadable encrypted backup they can unlock independently.',
  },
]

/* ═══════════════════════════════════════════════════════════
   Hooks
═══════════════════════════════════════════════════════════ */

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  }
}

function useCountdown(target: Date): TimeLeft {
  const [tl, setTl] = useState<TimeLeft>(() => getTimeLeft(target))
  useEffect(() => {
    const id = setInterval(() => setTl(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return tl
}

function useScrollReveal() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function useNavScroll(): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrolled
}

/* ═══════════════════════════════════════════════════════════
   Star Field
═══════════════════════════════════════════════════════════ */

function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => {
      const h = ((i * 2654435761) >>> 0)
      return {
        id: i,
        left: `${(h % 10000) / 100}%`,
        top: `${((h >> 8) % 10000) / 100}%`,
        size: h % 11 === 0 ? 2.5 : h % 5 === 0 ? 1.8 : 1,
        op: 0.15 + (h % 55) / 100,
        dur: `${2.5 + (h % 35) / 10}s`,
        del: `${(h % 45) / 10}s`,
      }
    }), [])

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--s-op': s.op,
            '--s-dur': s.dur,
            '--s-del': s.del,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Navigation
═══════════════════════════════════════════════════════════ */

function Nav({
  theme, toggleTheme, onOpen,
}: {
  theme: Theme
  toggleTheme: () => void
  onOpen: () => void
}) {
  const scrolled = useNavScroll()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            border: '1.5px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gold-glow)',
          }}>
            <Clock size={14} style={{ color: 'var(--gold)' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: 'var(--text-primary)',
          }}>
            TimeCapsule
          </span>
        </div>
      </Link>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
           className="hidden md:flex">
        {['How it Works', 'Explore', 'Pricing', 'FAQ'].map((label, i) => (
          <a
            key={label}
            href={['#how-it-works', '#explore', '#pricing', '#faq'][i]}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-bright)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="btn-gold hidden md:inline-flex" onClick={onOpen}>
          Create Capsule <ArrowRight size={15} />
        </button>
        <button
          className="btn-icon md:hidden"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {['How it Works', 'Explore', 'Pricing', 'FAQ'].map((label, i) => (
            <a
              key={label}
              href={['#how-it-works', '#explore', '#pricing', '#faq'][i]}
              onClick={() => setMobileOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}
            >
              {label}
            </a>
          ))}
          <button
            className="btn-gold"
            onClick={() => { setMobileOpen(false); onOpen() }}
            style={{ alignSelf: 'flex-start' }}
          >
            Create Capsule <ArrowRight size={15} />
          </button>
        </div>
      )}
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════
   Hero
═══════════════════════════════════════════════════════════ */

function HeroSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 1.5rem 4rem',
        background: `linear-gradient(180deg, var(--void) 0%, var(--deep) 100%)`,
      }}
    >
      <StarField />

      {/* Atmospheric orbs */}
      <div
        className="hero-orb"
        style={{
          width: 600, height: 600,
          top: '-10%', left: '-10%',
          background: 'radial-gradient(circle, rgba(200,169,109,0.09) 0%, transparent 65%)',
        }}
      />
      <div
        className="hero-orb"
        style={{
          width: 500, height: 500,
          bottom: '-5%', right: '-5%',
          background: 'radial-gradient(circle, rgba(61,111,168,0.1) 0%, transparent 65%)',
        }}
      />
      <div
        className="hero-orb"
        style={{
          width: 300, height: 300,
          top: '30%', right: '15%',
          background: 'radial-gradient(circle, rgba(139,127,196,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Floating decorative ring */}
      <div
        style={{
          position: 'absolute',
          width: 400, height: 400,
          border: '1px solid rgba(200,169,109,0.07)',
          borderRadius: '50%',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'absolute',
          width: 650, height: 650,
          border: '1px solid rgba(200,169,109,0.04)',
          borderRadius: '50%',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: 800,
          animation: 'fade-up 1s ease 0.1s both',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <span className="section-label">Est. 2025 · Time Capsule Platform</span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Send Memories{' '}
          <br />
          <span className="gradient-text">Into The Future.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            margin: '0 auto 2.75rem',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Create digital time capsules filled with messages, photos, and videos
          that unlock in the future — for your future self or someone you love.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3.5rem' }}>
          <button className="btn-gold" onClick={onOpen} style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
            Create Your Capsule <ArrowRight size={16} />
          </button>
          <a href="#explore" className="btn-ghost" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', textDecoration: 'none' }}>
            Explore Capsules
          </a>
        </div>

        {/* Social proof ticker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { value: '12,847', label: 'capsules sealed today' },
            { value: '94', label: 'countries' },
            { value: '2,031', label: 'unlocking this year' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 300,
                color: 'var(--gold-bright)',
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginTop: 4, textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#how-it-works"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          animation: 'float 3s ease-in-out infinite',
        }}
        aria-label="Scroll down"
      >
        <span>Scroll</span>
        <ChevronDown size={14} />
      </a>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   How It Works
═══════════════════════════════════════════════════════════ */

function HowItWorksSection() {
  const { ref, visible } = useScrollReveal()

  const steps = [
    {
      num: '01',
      icon: <Layers size={28} style={{ color: 'var(--gold)' }} />,
      title: 'Capture',
      desc: 'Write a message, upload photos, record a voice note, or attach a video. Mix and match — every capsule is yours to shape.',
    },
    {
      num: '02',
      icon: <Lock size={28} style={{ color: 'var(--gold)' }} />,
      title: 'Seal',
      desc: 'Choose your unlock date — tomorrow, a decade from now, or January 1st, 2100. Then seal it. You cannot unseal it before the day arrives.',
    },
    {
      num: '03',
      icon: <Sparkles size={28} style={{ color: 'var(--gold)' }} />,
      title: 'Discover',
      desc: 'When the moment comes, your capsule appears in your dashboard — exactly as you left it, waiting for you like a letter from your past self.',
    },
  ]

  return (
    <section
      id="how-it-works"
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-reveal ${visible ? 'visible' : ''}`}
      style={{ padding: '7rem 1.5rem', background: 'var(--deep)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-label">The Process</span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              marginTop: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            How It Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0.75rem auto 0', fontSize: '1rem' }}>
            Three steps to send a piece of today into the future.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {steps.map((step, idx) => (
            <div
              key={step.num}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-l)',
                padding: '2.25rem',
                position: 'relative',
                transition: 'transform 0.3s, border-color 0.3s',
                animationDelay: `${idx * 0.12}s`,
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-mid)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
              }}
            >
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'var(--gold-dim)',
                marginBottom: '1.25rem',
              }}>
                {step.num}
              </div>
              <div style={{ marginBottom: '1rem' }}>{step.icon}</div>
              <h3
                className="font-display"
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}
              >
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Capsule Card
═══════════════════════════════════════════════════════════ */

function CapsuleTypeIcon({ type }: { type: CapsuleType }) {
  const icons: Record<CapsuleType, ReactNode> = {
    message: <MessageSquare size={12} />,
    photo: <Camera size={12} />,
    video: <Video size={12} />,
    voice: <Mic size={12} />,
    mixed: <Layers size={12} />,
  }
  const labels: Record<CapsuleType, string> = {
    message: 'Message',
    photo: 'Photos',
    video: 'Video',
    voice: 'Voice',
    mixed: 'Mixed',
  }
  return (
    <span
      className="type-chip"
      style={{
        color: 'var(--text-muted)',
        borderColor: 'var(--border)',
        background: 'transparent',
      }}
    >
      {icons[type]} {labels[type]}
    </span>
  )
}

function getProgress(sealDate: Date, unlockDate: Date): number {
  const total = unlockDate.getTime() - sealDate.getTime()
  const elapsed = Date.now() - sealDate.getTime()
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

function SmallCountdown({ target }: { target: Date }) {
  const tl = useCountdown(target)
  if (tl.expired) return <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>Now Open</span>
  return (
    <div className="countdown-wrap">
      {[
        { v: tl.days, l: 'd' },
        { v: tl.hours, l: 'h' },
        { v: tl.minutes, l: 'm' },
        { v: tl.seconds, l: 's' },
      ].map(({ v, l }, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'baseline', gap: '0px' }}>
          {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 2px' }}>·</span>}
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 300,
            color: 'var(--gold-bright)',
          }}>
            {String(v).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginLeft: '1px' }}>
            {l}
          </span>
        </span>
      ))}
    </div>
  )
}

function CapsuleCard({ capsule }: { capsule: CapsuleData }) {
  const progress = getProgress(capsule.sealDate, capsule.unlockDate)

  return (
    <div className="capsule-card">
      {/* Color accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${capsule.accentColor}88 0%, ${capsule.accentColor} 40%, transparent 100%)`,
      }} />

      <div style={{ padding: '1.5rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <CapsuleTypeIcon type={capsule.type} />
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.65rem',
            color: capsule.isPublic ? 'var(--blue-bright)' : 'var(--text-muted)',
          }}>
            {capsule.isPublic ? <Globe size={11} /> : <Lock size={11} />}
            {capsule.isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display"
          style={{
            fontSize: '1.35rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            marginBottom: '0.35rem',
            lineHeight: 1.3,
          }}
        >
          {capsule.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          by {capsule.author}
        </p>

        {/* Preview text */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          filter: capsule.isPublic ? 'none' : 'blur(4px)',
          userSelect: capsule.isPublic ? 'auto' : 'none',
        }}>
          {capsule.preview}
        </p>

        {/* Countdown */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Unlocks in
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {Math.round(progress)}% elapsed
            </span>
          </div>
          <SmallCountdown target={capsule.unlockDate} />
          <div className="progress-track" style={{ marginTop: '0.75rem' }}>
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${capsule.accentColor}60 0%, ${capsule.accentColor} 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Featured Capsules Section
═══════════════════════════════════════════════════════════ */

function FeaturedCapsulesSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="explore"
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-reveal ${visible ? 'visible' : ''}`}
      style={{ padding: '7rem 1.5rem', background: 'var(--void)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-label">Explore</span>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                marginTop: '0.75rem',
                color: 'var(--text-primary)',
              }}
            >
              Capsules in the Wild
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 300, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Public capsules shared with the world. Each one, a window into someone's past.
          </p>
        </div>

        {/* Ad slot — above fold of capsule feed */}
        <div className="ad-slot" style={{ marginBottom: '1.5rem' }}>
          Advertisement · 728×90
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {CAPSULES.map(c => <CapsuleCard key={c.id} capsule={c} />)}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Countdown Showcase
═══════════════════════════════════════════════════════════ */

function LargeCountdown({ target }: { target: Date }) {
  const tl = useCountdown(target)
  const units = [
    { v: tl.days, l: 'Days' },
    { v: tl.hours, l: 'Hours' },
    { v: tl.minutes, l: 'Minutes' },
    { v: tl.seconds, l: 'Seconds' },
  ]

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '0.5rem', justifyContent: 'center' }}>
      {units.map(({ v, l }, i) => (
        <div key={l} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.3rem' }}>
          {i > 0 && (
            <span className="countdown-sep-large" style={{ opacity: 0.3 }}>:</span>
          )}
          <div className="countdown-unit">
            <span className="countdown-value-large">{String(v).padStart(2, '0')}</span>
            <span className="countdown-label">{l}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function CountdownShowcaseSection() {
  const { ref, visible } = useScrollReveal()
  const unlockDate = new Date('2100-01-01')

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '7rem 1.5rem',
        background: 'var(--surface-1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 800, height: 400,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(200,169,109,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span className="section-label">Featured · The Century Capsule</span>

        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            margin: '1.25rem 0 0.75rem',
            color: 'var(--text-primary)',
          }}
        >
          A Message to Humanity
        </h2>

        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 3rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Sealed by 16.899 contributors from 112 countries. Opening January 1st, 2030 — a time capsule for the next century.
        </p>

        <div
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--border-mid)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 0 80px var(--gold-glow), inset 0 0 60px rgba(200,169,109,0.03)',
          }}
        >
          <div style={{ marginBottom: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Unlocking in
          </div>
          <LargeCountdown target={unlockDate} />
          <div className="glow-divider" style={{ margin: '2.5rem 0 2rem' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { v: '12,847', l: 'Contributors' },
              { v: '94', l: 'Countries' },
              { v: '73 yrs', l: 'Until Opening' },
            ].map(stat => (
              <div key={stat.l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 300,
                  color: 'var(--gold)',
                }}>{stat.v}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Testimonials
═══════════════════════════════════════════════════════════ */

function TestimonialsSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-reveal ${visible ? 'visible' : ''}`}
      style={{ padding: '7rem 1.5rem', background: 'var(--deep)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Stories</span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              marginTop: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            From People Who Sealed Moments
          </h2>
        </div>

        {/* Ad slot between sections */}
        <div className="ad-slot" style={{ marginBottom: '2rem' }}>
          Advertisement · 728×90
        </div>

        {/* Asymmetric testimonial grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}
             className="md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.author}
              className="testimonial-card"
              style={{
                gridRow: i === 2 ? 'span 1' : 'auto',
                padding: '2rem',
              }}
            >
              {/* Quote mark */}
              <div
                className="font-display"
                style={{
                  fontSize: '4rem',
                  lineHeight: 0.8,
                  color: t.accent,
                  opacity: 0.4,
                  marginBottom: '1rem',
                  fontWeight: 400,
                }}
              >
                "
              </div>
              <p style={{
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}>
                {t.quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: `${t.accent}22`,
                  border: `1px solid ${t.accent}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  color: t.accent,
                  flexShrink: 0,
                }}>
                  {t.initial}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t.author}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Pricing
═══════════════════════════════════════════════════════════ */

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'For personal exploration.',
    features: [
      '2 capsules',
      'Text messages only',
      'Max 1-year lock',
      'Community support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Keeper',
    price: '$6',
    period: '/mo',
    desc: 'For the ones worth preserving.',
    features: [
      '20 capsules',
      'Photos & voice notes',
      'Up to 50-year lock',
      'AI memory summaries',
      'Priority support',
      'Legacy Key recovery',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Legacy',
    price: '$18',
    period: '/mo',
    desc: 'For a lifetime of moments.',
    features: [
      'Unlimited capsules',
      'Video uploads (4K)',
      'Lifetime delivery',
      'Estate transfer',
      'Premium templates',
      'Encrypted backup',
      'Dedicated support',
    ],
    cta: 'Go Legacy',
    featured: false,
  },
]

function PricingSection({ onOpen }: { onOpen: () => void }) {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="pricing"
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-reveal ${visible ? 'visible' : ''}`}
      style={{ padding: '7rem 1.5rem', background: 'var(--void)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Pricing</span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              marginTop: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Choose Your Plan
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: '0.75rem auto 0', fontSize: '0.95rem' }}>
            Start free. Upgrade when your memories deserve more.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
          {PLANS.map(plan => (
            <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                  color: 'var(--void)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '0.25rem 1rem',
                  borderRadius: '0 0 8px 8px',
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: '0.5rem', paddingTop: plan.featured ? '1rem' : '0' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: plan.featured ? 'var(--gold)' : 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                  {plan.name}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '0.5rem' }}>
                <span className="font-display" style={{ fontSize: '2.8rem', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plan.period}</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {plan.desc}
              </p>

              <div className="glow-divider" style={{ marginBottom: '1.25rem', opacity: plan.featured ? 0.35 : 0.15 }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Check size={14} style={{ color: plan.featured ? 'var(--gold)' : 'var(--text-muted)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={plan.featured ? 'btn-gold' : 'btn-ghost'}
                onClick={onOpen}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════════════ */

function FAQSection() {
  const { ref, visible } = useScrollReveal()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-reveal ${visible ? 'visible' : ''}`}
      style={{ padding: '7rem 1.5rem', background: 'var(--surface-1)' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">FAQ</span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              marginTop: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Questions Across Time
          </h2>
        </div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="accordion-item">
              <button
                className="accordion-trigger"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`accordion-icon ${open === i ? 'open' : ''}`}
                />
              </button>
              <div className={`accordion-body ${open === i ? 'open' : ''}`}>
                <div className="accordion-body-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ad slot at end of FAQ */}
        <div className="ad-slot" style={{ marginTop: '2.5rem' }}>
          Advertisement · 300×250
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Footer
═══════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer style={{
      background: 'var(--void)',
      borderTop: '1px solid var(--border)',
      padding: '4rem 1.5rem 2.5rem',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                border: '1px solid var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--gold-glow)',
              }}>
                <Clock size={12} style={{ color: 'var(--gold)' }} />
              </div>
              <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.05em' }}>
                TimeCapsule
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 220 }}>
              Preserve what matters. Send it forward.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: 'Product',
              links: ['Create Capsule', 'Explore', 'Pricing', 'Security'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Press'],
            },
            {
              title: 'Support',
              links: ['Help Center', 'FAQ', 'Privacy Policy', 'Terms of Service'],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '1rem',
              }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="glow-divider" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2025 TimeCapsule. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[Twitter, Github, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="btn-icon"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   Create Capsule Modal
═══════════════════════════════════════════════════════════ */

const CAPSULE_TYPES: { type: CapsuleType; icon: ReactNode; label: string; desc: string }[] = [
  { type: 'message', icon: <FileText size={22} />, label: 'Message', desc: 'Write a letter to the future' },
  { type: 'photo', icon: <Camera size={22} />, label: 'Photos', desc: 'A gallery of this moment' },
  { type: 'video', icon: <Video size={22} />, label: 'Video', desc: 'Record yourself today' },
  { type: 'voice', icon: <Mic size={22} />, label: 'Voice Note', desc: 'Your voice, preserved' },
]

function CreateCapsuleModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<ModalStep>(1)
  const [selectedType, setSelectedType] = useState<CapsuleType | null>(null)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [unlockDate, setUnlockDate] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [sealed, setSealed] = useState(false)

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const handleSeal = useCallback(() => {
    setSealed(true)
  }, [])

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <h2
              className="font-display"
              style={{ fontSize: '1.5rem', fontWeight: 400, fontStyle: 'italic', color: 'var(--text-primary)' }}
            >
              {sealed ? 'Capsule Sealed' : 'New Capsule'}
            </h2>
            {!sealed && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Step {step} of 4
              </p>
            )}
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        {!sealed && (
          <div className="step-indicator" style={{ marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`step-dot ${s === step ? 'active' : s < step ? 'done' : ''}`}
              />
            ))}
          </div>
        )}

        {/* ── Success state ── */}
        {sealed && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: 72, height: 72,
              borderRadius: '50%',
              background: 'var(--gold-glow)',
              border: '1px solid var(--border-mid)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}>
              <Lock size={28} style={{ color: 'var(--gold)' }} />
            </div>
            <h3 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, fontStyle: 'italic', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Your capsule is sealed.
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 340, margin: '0 auto 2rem' }}>
              It will unlock on {unlockDate || 'the date you chose'} — and not a moment before.
              We'll send you a reminder when the day arrives.
            </p>
            <button className="btn-gold" onClick={onClose} style={{ margin: '0 auto' }}>
              Done <Check size={15} />
            </button>
          </div>
        )}

        {/* ── Step 1: Choose type ── */}
        {!sealed && step === 1 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              What's inside your capsule?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {CAPSULE_TYPES.map(ct => (
                <button
                  key={ct.type}
                  onClick={() => setSelectedType(ct.type)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-m)',
                    border: `1px solid ${selectedType === ct.type ? 'var(--gold)' : 'var(--border)'}`,
                    background: selectedType === ct.type ? 'var(--gold-glow)' : 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.2s, background 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ color: selectedType === ct.type ? 'var(--gold)' : 'var(--text-muted)' }}>
                    {ct.icon}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ct.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ct.desc}</span>
                </button>
              ))}
            </div>
            <button
              className="btn-gold"
              onClick={() => selectedType && setStep(2)}
              disabled={!selectedType}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '1.5rem',
                opacity: selectedType ? 1 : 0.4,
                cursor: selectedType ? 'pointer' : 'not-allowed',
              }}
            >
              Continue <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ── Step 2: Content ── */}
        {!sealed && step === 2 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Write your message
            </h3>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Dear future self, by the time you read this…"
              style={{
                width: '100%',
                minHeight: 220,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-m)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                padding: '1rem 1.25rem',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-mid)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {message.length} characters
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                AI summary will be generated on seal
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button
                className="btn-gold"
                onClick={() => setStep(3)}
                style={{ flex: 2, justifyContent: 'center' }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Date & settings ── */}
        {!sealed && step === 3 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              When should it unlock?
            </h3>

            <label style={{ display: 'block', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                Unlock Date
              </span>
              <input
                type="date"
                min={minDateStr}
                value={unlockDate}
                onChange={e => setUnlockDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-s)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem 1rem',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                Capsule Title
              </span>
              <input
                type="text"
                placeholder="A letter to my future self"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-s)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem 1rem',
                  outline: 'none',
                }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.75rem' }}>
              <div
                onClick={() => setIsPublic(v => !v)}
                style={{
                  width: 42, height: 24,
                  borderRadius: 12,
                  background: isPublic ? 'var(--gold)' : 'var(--surface-3)',
                  position: 'relative',
                  transition: 'background 0.25s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 3, left: isPublic ? 21 : 3,
                  width: 18, height: 18,
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.25s',
                }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Make Public
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Others can see it exists (but not its contents) until it unlocks
                </div>
              </div>
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-ghost" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button
                className="btn-gold"
                onClick={() => unlockDate && setStep(4)}
                disabled={!unlockDate}
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  opacity: unlockDate ? 1 : 0.4,
                  cursor: unlockDate ? 'pointer' : 'not-allowed',
                }}
              >
                Review Capsule <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Review & seal ── */}
        {!sealed && step === 4 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Ready to seal?
            </h3>

            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-m)',
              padding: '1.25rem',
              marginBottom: '1.25rem',
            }}>
              {[
                { label: 'Type', value: selectedType ? CAPSULE_TYPES.find(t => t.type === selectedType)?.label : '—' },
                { label: 'Title', value: title || 'Untitled Capsule' },
                { label: 'Unlock Date', value: unlockDate || '—' },
                { label: 'Visibility', value: isPublic ? 'Public' : 'Private' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.875rem',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              Once sealed, your capsule cannot be edited or opened before the unlock date. This is intentional — the integrity of the moment is the point.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-ghost" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button
                className="btn-gold"
                onClick={handleSeal}
                style={{ flex: 2, justifyContent: 'center' }}
              >
                <Lock size={15} /> Seal Capsule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Home Page
═══════════════════════════════════════════════════════════ */

function Home() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const openModal = useCallback(() => setShowModal(true), [])
  const closeModal = useCallback(() => setShowModal(false), [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav theme={theme} toggleTheme={toggleTheme} onOpen={openModal} />
      <main>
        <HeroSection onOpen={openModal} />
        <HowItWorksSection />
        <FeaturedCapsulesSection />
        <CountdownShowcaseSection />
        <TestimonialsSection />
        <PricingSection onOpen={openModal} />
        <FAQSection />
      </main>
      <Footer />
      {showModal && <CreateCapsuleModal onClose={closeModal} />}
    </>
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <div>
      <h1>TimeCapsule</h1>
      import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <div>
      <h1>TimeCapsule</h1>

      {/* REKLAM */}
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: 728, height: 90 }}
        data-ad-client="ca-pub-5934642727917171"
        data-ad-slot="4361942093"
      />
    </div>
  )
}
