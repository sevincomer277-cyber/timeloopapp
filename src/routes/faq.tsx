import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown, ArrowLeft, Clock } from 'lucide-react'

export const Route = createFileRoute('/faq')({
  component: FAQPage,
})

const FAQ_ITEMS = [
  {
    q: 'When exactly is my capsule delivered?',
    a: "Your capsule unlocks at midnight on the date you set, adjusted to the timezone you were in when you created it. You'll receive an email notification, and the capsule appears in your dashboard ready to open.",
  },
  {
    q: 'What happens if I forget my account credentials?',
    a: "We offer email-based recovery, plus a Legacy Key — a printable recovery code you generate when creating high-stakes capsules. We strongly recommend generating a Legacy Key for any capsule set to open years from now.",
  },
  {
    q: 'Can I edit a capsule after sealing it?',
    a: 'No — and that\'s by design. The integrity of the original moment is what gives it meaning. However, you can add a "Postscript" at any time, which is delivered alongside the original without altering it.',
  },
  {
    q: 'Is my content private and secure?',
    a: "All capsule content is encrypted at rest using AES-256. Private capsules are additionally wrapped with a unique per-user key. Even our team cannot read your sealed capsules. Public capsules reveal their content only after their unlock date.",
  },
  {
    q: 'What if TimeCapsule shuts down before my capsule unlocks?',
    a: "We maintain a 5-year operational reserve specifically to ensure capsule delivery even in the event of business closure. Legacy plan subscribers also receive a downloadable encrypted backup they can unlock independently.",
  },
  {
    q: 'How does the AI memory summary work?',
    a: "When you seal a capsule (Keeper and Legacy plans), our AI generates a brief poetic summary of your message. This summary is visible in your dashboard as a hint of what's inside — without revealing the full content.",
  },
  {
    q: 'Can I send a capsule to someone else?',
    a: "Yes. When creating your capsule, you can choose to deliver it to another person's email address. They'll receive an invitation to create an account, and the capsule will appear in their dashboard when it unlocks.",
  },
  {
    q: 'What file types and sizes are supported?',
    a: 'Free: text only. Keeper: JPEG, PNG, MP3, M4A up to 50MB total. Legacy: all of the above plus MP4 video (4K, up to 2GB per capsule), plus raw file attachments.',
  },
]

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', paddingTop: '5rem' }}>
      {/* Minimal nav */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(6,6,14,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 2rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          border: '1px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--gold-glow)', flexShrink: 0,
        }}>
          <Clock size={11} style={{ color: 'var(--gold)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
          TimeCapsule
        </span>
        <div style={{ flex: 1 }} />
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem',
          }}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--gold)', padding: '0.25rem 0.75rem',
            border: '1px solid var(--border-mid)', borderRadius: '999px',
            background: 'var(--gold-glow)', marginBottom: '1.25rem',
          }}>
            Help & FAQ
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: 'var(--text-primary)', marginBottom: '0.75rem',
          }}>
            Questions Across Time
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 480, margin: '0 auto' }}>
            Everything you need to know about creating, sealing, and opening your time capsules.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '1.4rem 0',
                  background: 'none', border: 'none',
                  color: open === i ? 'var(--gold-bright)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-body)', fontSize: '1rem',
                  fontWeight: 500, textAlign: 'left', cursor: 'pointer',
                  transition: 'color 0.2s', gap: '1rem',
                }}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    color: 'var(--gold)', flexShrink: 0,
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              <div style={{
                maxHeight: open === i ? '400px' : '0',
                overflow: 'hidden', opacity: open === i ? 1 : 0,
                transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
              }}>
                <p style={{ paddingBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{
          marginTop: '3rem', padding: '2rem',
          background: 'var(--glass)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-l)', textAlign: 'center',
          backdropFilter: 'blur(16px)',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Still have questions? We would love to help.
          </p>
          <a
            href="mailto:hello@timecapsule.app"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-m)',
              background: 'linear-gradient(135deg, #a8782c, #e8cb8c, #c8a96d, #8a6030)',
              backgroundSize: '200% auto', color: '#06060e',
              fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(200,169,109,0.22)',
            }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
