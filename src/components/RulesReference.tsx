import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VALID_RULES = [
  'Exactly ONE mark (✓) in ONE party box',
  'Mark must be clearly inside a single cell',
  'Election officer signature present at bottom',
  'Ballot is intact — no tears or damage',
  'No identifying marks, names, or writing',
];

const INVALID_RULES: { label: string; desc: string }[] = [
  { label: 'Multiple Marks',    desc: 'Two or more cells are marked' },
  { label: 'Blank Ballot',      desc: 'No mark made anywhere on the ballot' },
  { label: 'Border Mark',       desc: 'Mark falls between two cells — intent unclear' },
  { label: 'Identifying Marks', desc: 'Name, signature, or other writing on ballot' },
  { label: 'No Signature',      desc: 'Election officer signature is missing' },
  { label: 'Torn / Damaged',    desc: 'Physical damage makes intent unreadable' },
];

export default function RulesReference() {
  return (
    <div
      className="rounded flex-1 overflow-y-auto rules-scrol"
      style={{
        background: 'rgba(15, 8, 5, 0.92)',
        border: '1px solid rgba(180, 150, 100, 0.22)',
      }}
    >
      {/* Header — always visible */}
      <div
        className="px-3 py-2"
        style={{ borderBottom: '1px solid rgba(180,150,100,0.18)' }}
      >
        <p className="font-typewriter tracking-widest uppercase" style={{ color: '#b8960c', fontSize: '0.72rem' }}>
          ELECTION RULES
        </p>
      </div>

      <div className="px-3 py-3 flex flex-col gap-6">
        {/* Valid section */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-6" style={{ color: '#2a9a2a' }}>
            <FiCheckCircle size={13} />
            <span className="font-typewriter tracking-wider uppercase" style={{ fontSize: '0.7rem' }}>
              Valid Ballot
            </span>
          </div>
          <ul className="space-y-1.5">
            {VALID_RULES.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5" style={{ color: '#8ab88a', fontSize: '0.72rem', lineHeight: 1.45 }}>
                <span style={{ color: '#2a9a2a', marginTop: 2, flexShrink: 0 }}>·</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Invalid section */}
        <div>
          <div className="flex items-center gap-1.5 mb-6" style={{ color: '#cc2222' }}>
            <FiXCircle size={13} />
            <span className="font-typewriter tracking-wider uppercase" style={{ fontSize: '0.7rem' }}>
              Invalid Ballot
            </span>
          </div>
          <ul className="space-y-2">
            {INVALID_RULES.map((r, i) => (
              <li key={i} style={{ fontSize: '0.72rem', lineHeight: 1.45 }}>
                <span className="font-bold capitalize" style={{ color: '#ee4444' }}>{r.label}</span>
                <br />
                <span style={{ color: '#8a6868', fontSize: '0.67rem' }}>{r.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-4 pt-3"
          style={{ borderTop: '1px solid rgba(180,150,100,0.12)', color: '#4a3a2a', fontSize: '0.63rem', lineHeight: 1.5 }}
        >
          Nepal Election Commission<br />
          Representation of the People Act, 2074 BS
        </div>
      </div>
    </div>
  );
}
