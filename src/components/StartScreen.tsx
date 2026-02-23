import { FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { GiStamper } from 'react-icons/gi';

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  return (
    <div
      className="min-h-screen md:h-screen w-full max-w-full desk-surface flex flex-col items-center justify-center relative overflow-y-auto md:overflow-hidden"
    >
      <div className="scanlines" />

      {/* Ambient top light strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(184,150,12,0.3), transparent)' }}
      />

      <div className="flex flex-col md:flex-row gap-6 items-start max-w-4xl w-full px-6 md:px-6 py-16 md:py-0">
        {/* LEFT: Main title panel */}
        <div
          className="flex-1 rounded p-6"
          style={{
            background: 'rgba(26, 18, 8, 0.95)',
            border: '1px solid rgba(184, 150, 12, 0.3)',
            boxShadow: '0 0 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Header logo */}
          <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(184,150,12,0.2)' }}>
            <GiStamper size={28} style={{ color: '#b8960c' }} className="animate-flicker" />
            <div>
              <p className="font-typewriter tracking-widest uppercase text-xs" style={{ color: '#b8960c' }}>
                Nepal Election Commission
              </p>
              <p
                className="font-nepali font-bold"
                style={{ color: '#d4b030', fontSize: '0.8rem', fontFamily: "'Noto Sans Devanagari', serif" }}
              >
                नेपाल निर्वाचन आयोग
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <h1
              className="font-typewriter text-2xl md:text-3xl font-bold tracking-widest uppercase"
              style={{ color: '#f4edd8', lineHeight: 1.1, marginBottom: 4 }}
            >
              BALLOT
            </h1>
            <h1
              className="font-typewriter text-2xl md:text-3xl font-bold tracking-widest uppercase"
              style={{ color: '#f4edd8', lineHeight: 1.1, marginBottom: 4 }}
            >
              INSPECTOR
            </h1>
            <p
              className="font-nepali"
              style={{ color: '#9a8870', fontSize: '0.75rem', fontFamily: "'Noto Sans Devanagari', serif" }}
            >
              मतपत्र परीक्षक — मतगणना विभाग
            </p>
          </div>

          {/* Story text */}
          <div
            className="mb-5 p-3 rounded"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="font-typewriter" style={{ color: '#9a8870', fontSize: '0.82rem', lineHeight: 1.7 }}>
              You have been assigned to the{' '}
              <span style={{ color: '#c8b89a' }}>Ballot Validation Station</span> of the
              Election Commission of Nepal.
            </p>
            <p className="font-typewriter mt-2" style={{ color: '#9a8870', fontSize: '0.82rem', lineHeight: 1.7 }}>
              Your duty: examine each{' '}
              <span style={{ color: '#c8b89a' }}>Proportional Representation ballot</span>{' '}
              and determine whether it is{' '}
              <span style={{ color: '#22cc44' }}>VALID</span> or{' '}
              <span style={{ color: '#ee3333' }}>INVALID</span> before time runs out.
            </p>
            <p className="font-typewriter mt-2" style={{ color: '#9a8870', fontSize: '0.82rem', lineHeight: 1.7 }}>
              The integrity of the election depends on your accuracy.
            </p>
          </div>

          {/* Warning */}
          <div
            className="flex items-start gap-2 mb-5 p-2 rounded"
            style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.25)' }}
          >
            <FiAlertTriangle size={12} style={{ color: '#cc3333', marginTop: 2, flexShrink: 0 }} />
            <p className="font-typewriter" style={{ color: '#cc9988', fontSize: '0.78rem', lineHeight: 1.5 }}>
              Wrong decisions cost{' '}
              <span style={{ color: '#ff6666' }}>−8 seconds</span>. Each correct decision earns{' '}
              <span style={{ color: '#66cc66' }}>+2 seconds</span>. The shift ends when time expires.
            </p>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-3 py-3 rounded font-typewriter tracking-widest uppercase transition-all duration-200"
            style={{
              background: 'rgba(184, 150, 12, 0.12)',
              border: '2px solid #b8960c',
              color: '#d4b030',
              fontSize: '0.85rem',
              letterSpacing: '0.25em',
              boxShadow: '0 0 20px rgba(184,150,12,0.1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,150,12,0.22)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(184,150,12,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,150,12,0.12)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(184,150,12,0.1)';
            }}
          >
            <span>REPORT FOR DUTY</span>
            <FiChevronRight size={16} />
          </button>

          {/* Flavour footer */}
          <p
            className="text-center font-typewriter mt-6"
            style={{ color: '#3a2a18', fontSize: '0.55rem', letterSpacing: '0.1em' }}
          >
            ELECTION COMMISSION OF NEPAL · KATHMANDU, 2079 BS
          </p>
        </div>

        {/* RIGHT: Rules quick-ref */}
        <div
          className="rounded p-5 w-full md:w-[260px] md:flex-shrink-0"
          style={{
            background: 'rgba(26, 18, 8, 0.95)',
            border: '1px solid rgba(184, 150, 12, 0.2)',
          }}
        >
          <p className="font-typewriter tracking-widest uppercase mb-4" style={{ color: '#b8960c', fontSize: '0.78rem' }}>
            QUICK REFERENCE
          </p>

          <div className="mb-5">
            <p className="font-typewriter mb-2" style={{ color: '#22cc44', fontSize: '0.8rem' }}>
              ✓ VALID IF:
            </p>
            <ul className="space-y-1.5">
              {[
                'One ✓ mark in one box',
                'Clearly inside the cell',
                'Signature present',
                'Ballot undamaged',
                'No identifying marks',
              ].map((r, i) => (
                <li key={i} className="font-typewriter" style={{ color: '#7a9a7a', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  · {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-typewriter mb-2" style={{ color: '#ee3333', fontSize: '0.8rem' }}>
              ✗ INVALID IF:
            </p>
            <ul className="space-y-1.5">
              {[
                'Multiple marks',
                'Blank — no mark',
                'Mark on border',
                'Writing/names present',
                'No officer signature',
                'Torn or damaged',
              ].map((r, i) => (
                <li key={i} className="font-typewriter" style={{ color: '#9a7070', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  · {r}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="mt-5 pt-3"
            style={{ borderTop: '1px solid rgba(184,150,12,0.15)' }}
          >
            <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.75rem', lineHeight: 1.8 }}>
              HOT KEYS<br />
              <span style={{ color: '#7a6a5a' }}>[V] — Valid</span><br />
              <span style={{ color: '#7a6a5a' }}>[I] — Invalid</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-4 md:mt-0 md:absolute md:bottom-8 left-0 right-0 flex justify-center pb-4 md:pb-0">
        <p
          className="text-sm flex flex-wrap items-center justify-center gap-1.5"
        >
          <span>Created by</span>
          <a
            href="https://www.animeshbasnet.com.np/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
            style={{ color: '#b8960c' }}
          >
            <span className="font-medium">Crypticsy</span>
            <img
              src="https://github.com/crypticsy.png"
              alt="Crypticsy"
              className="w-7 h-7 rounded-full"
              style={{ border: '2px solid rgba(184,150,12,0.5)' }}
            />
          </a>
        </p>
      </div>
    </div>
  );
}
