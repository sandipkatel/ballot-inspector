import type { GameStats } from '../types';
import { FiCheckCircle, FiXCircle, FiRotateCcw, FiAward } from 'react-icons/fi';
import { GiStamper } from 'react-icons/gi';

interface Props {
  stats: GameStats;
  onRestart: () => void;
}

function getGrade(accuracy: number, score: number): { grade: string; label: string; color: string; nepali: string } {
  if (accuracy >= 90 && score >= 100) return { grade: 'S', label: 'EXEMPLARY', color: '#d4b030', nepali: 'उत्कृष्ट' };
  if (accuracy >= 80) return { grade: 'A', label: 'COMMENDABLE', color: '#1a6b1a', nepali: 'प्रशंसनीय' };
  if (accuracy >= 70) return { grade: 'B', label: 'SATISFACTORY', color: '#4a7a9a', nepali: 'सन्तोषजनक' };
  if (accuracy >= 60) return { grade: 'C', label: 'MARGINAL', color: '#8a6a00', nepali: 'सामान्य' };
  if (accuracy >= 50) return { grade: 'D', label: 'INADEQUATE', color: '#8a4a00', nepali: 'अपर्याप्त' };
  return { grade: 'F', label: 'FAILED', color: '#8b0000', nepali: 'असफल' };
}

function getFlavorText(grade: string): string {
  switch (grade) {
    case 'S': return '"Your dedication to electoral integrity is unmatched. The Commission is proud."';
    case 'A': return '"Well done. The democratic process is in capable hands."';
    case 'B': return '"Satisfactory performance. Further training may improve accuracy."';
    case 'C': return '"Several errors were noted. A review of procedures is recommended."';
    case 'D': return '"Significant errors compromised ballot integrity. Retraining required."';
    default:  return '"Your performance has jeopardized the election. You are relieved of duty."';
  }
}

export default function EndScreen({ stats, onRestart }: Props) {
  const accuracy = stats.totalSeen > 0 ? Math.round((stats.correct / stats.totalSeen) * 100) : 0;
  const { grade, label, color, nepali } = getGrade(accuracy, stats.score);

  return (
    <div className="min-h-screen w-full max-w-full desk-surface flex flex-col items-center relative">
      <div className="scanlines" />

      <div className="w-full max-w-4xl px-4 md:px-6 py-6 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 items-start flex-1">

          {/* Main results panel */}
          <div
            className="flex-1 w-full rounded p-5 md:p-6"
            style={{
              background: 'rgba(26, 18, 8, 0.95)',
              border: '1px solid rgba(184,150,12,0.25)',
              boxShadow: '0 0 40px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(184,150,12,0.2)' }}>
              <GiStamper size={24} style={{ color: '#b8960c' }} />
              <div>
                <p className="font-typewriter tracking-widest uppercase text-xs" style={{ color: '#b8960c' }}>
                  Election Commission of Nepal
                </p>
                <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.6rem' }}>
                  END OF SHIFT · PERFORMANCE REPORT
                </p>
              </div>
            </div>

            {/* Grade stamp */}
            <div className="flex items-center gap-5 mb-6">
              <div
                className="flex items-center justify-center font-typewriter font-bold rounded shrink-0"
                style={{
                  width: 80, height: 80,
                  border: `4px solid ${color}`,
                  color,
                  fontSize: '2.5rem',
                  transform: 'rotate(-8deg)',
                  boxShadow: `0 0 20px ${color}33`,
                }}
              >
                {grade}
              </div>
              <div>
                <p className="font-typewriter font-bold tracking-widest uppercase" style={{ color, fontSize: '1.1rem' }}>
                  {label}
                </p>
                <p style={{ color: '#9a8870', fontFamily: "'Noto Sans Devanagari', serif", fontSize: '0.85rem' }}>
                  {nepali}
                </p>
                <p className="font-typewriter mt-1" style={{ color: '#5a4a3a', fontSize: '0.6rem', maxWidth: 280, lineHeight: 1.5 }}>
                  {getFlavorText(grade)}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'FINAL SCORE', value: String(stats.score), color: '#d4b030' },
                { label: 'ACCURACY', value: `${accuracy}%`, color: '#c8b89a' },
                { label: 'CORRECT', value: String(stats.correct), color: '#1a6b1a' },
                { label: 'INCORRECT', value: String(stats.incorrect), color: '#cc3333' },
                { label: 'BALLOTS REVIEWED', value: String(stats.totalSeen), color: '#9a8870' },
                { label: 'TIME ELAPSED', value: `${stats.timeElapsed}s`, color: '#9a8870' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded p-3"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.55rem', letterSpacing: '0.1em' }}>
                    {s.label}
                  </p>
                  <p className="font-mono font-bold" style={{ color: s.color, fontSize: '1.4rem', lineHeight: 1 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Decision breakdown */}
            {stats.decisions.length > 0 && (
              <div
                className="mb-5 p-3 rounded"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}
              >
                <p className="font-typewriter mb-2" style={{ color: '#5a4a3a', fontSize: '0.55rem', letterSpacing: '0.1em' }}>
                  BALLOT DECISIONS
                </p>
                <div className="flex flex-wrap gap-1">
                  {stats.decisions.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded"
                      style={{
                        width: 20, height: 20,
                        background: d.correct ? 'rgba(0,77,0,0.4)' : 'rgba(139,0,0,0.4)',
                        border: `1px solid ${d.correct ? '#004d00' : '#8b0000'}`,
                      }}
                      title={`Ballot #${d.ballotId}: ${d.correct ? 'Correct' : 'Wrong'}`}
                    >
                      {d.correct
                        ? <FiCheckCircle size={10} style={{ color: '#4a9a4a' }} />
                        : <FiXCircle size={10} style={{ color: '#cc4444' }} />
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restart button */}
            <button
              onClick={onRestart}
              className="w-full flex items-center justify-center gap-3 py-3 rounded font-typewriter tracking-widest uppercase transition-all duration-200"
              style={{
                background: 'rgba(184,150,12,0.1)',
                border: '2px solid #b8960c',
                color: '#d4b030',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,150,12,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,150,12,0.1)'; }}
            >
              <FiRotateCcw size={14} />
              <span>ANOTHER SHIFT</span>
            </button>
          </div>

          {/* Right: Accuracy breakdown by type */}
          <div
            className="w-full md:shrink-0 rounded p-4"
            style={{
              background: 'rgba(26,18,8,0.95)',
              border: '1px solid rgba(184,150,12,0.2)',
            }}
          >
            <p className="font-typewriter mb-3" style={{ color: '#b8960c', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
              ERROR ANALYSIS
            </p>

            {/* Breakdown by invalid reason */}
            {(() => {
              const reasons: Record<string, { total: number; correct: number }> = {};
              for (const d of stats.decisions) {
                const key = d.invalidReason ?? 'valid';
                if (!reasons[key]) reasons[key] = { total: 0, correct: 0 };
                reasons[key].total++;
                if (d.correct) reasons[key].correct++;
              }
              const labels: Record<string, string> = {
                valid: 'VALID ballots',
                multiple_marks: 'Multiple marks',
                blank: 'Blank ballots',
                border_mark: 'Border marks',
                identifying_marks: 'ID marks',
                no_signature: 'No signature',
                torn: 'Torn ballots',
              };
              return Object.entries(reasons).map(([k, v]) => (
                <div key={k} className="mb-2">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-typewriter" style={{ color: '#7a6a5a', fontSize: '0.55rem' }}>
                      {labels[k] ?? k}
                    </span>
                    <span className="font-typewriter" style={{ color: '#9a8870', fontSize: '0.55rem' }}>
                      {v.correct}/{v.total}
                    </span>
                  </div>
                  <div className="rounded overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.round((v.correct / v.total) * 100)}%`,
                        background: v.correct / v.total >= 0.7 ? '#004d00' : v.correct / v.total >= 0.5 ? '#8a6a00' : '#8b0000',
                      }}
                    />
                  </div>
                </div>
              ));
            })()}

            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(184,150,12,0.1)' }}>
              <div className="flex items-center gap-1 mb-1">
                <FiAward size={10} style={{ color: '#b8960c' }} />
                <p className="font-typewriter" style={{ color: '#b8960c', fontSize: '0.55rem' }}>RATING SCALE</p>
              </div>
              {[['S', '90%+ & 100+ pts', '#d4b030'], ['A', '80%+', '#1a6b1a'], ['B', '70%+', '#4a7a9a'],
                ['C', '60%+', '#8a6a00'], ['D', '50%+', '#8a4a00'], ['F', '<50%', '#8b0000']].map(([g, t, c]) => (
                <p key={g} className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.52rem', lineHeight: 1.6 }}>
                  <span style={{ color: c as string }}>{g}</span> — {t}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
