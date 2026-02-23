import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { BallotData, GameStats, PlayerDecision } from '../types';
import { generateBallotQueue } from '../data/ballotGenerator';
import BallotDisplay from './BallotDisplay';
import Timer from './Timer';
import RulesReference from './RulesReference';
import FeedbackOverlay from './FeedbackOverlay';
import { FiCheckCircle, FiXCircle, FiFileText, FiUser } from 'react-icons/fi';
import { GiStamper } from 'react-icons/gi';

const TOTAL_BALLOTS = 20;
const INITIAL_TIME = 120;
const CORRECT_BONUS = 2;
const WRONG_PENALTY = 8;

interface VoterProfile {
  name: string;
  age: number;
  district: string;
  face: string; // emoji
  voterId: string;
}

const VOTER_POOL: Omit<VoterProfile, 'age' | 'voterId'>[] = [
  { name: 'Ram Bahadur Thapa',     face: '👨', district: 'Kathmandu' },
  { name: 'Sita Kumari Sharma',    face: '👩', district: 'Lalitpur' },
  { name: 'Krishna Pd. Adhikari',  face: '👴', district: 'Bhaktapur' },
  { name: 'Laxmi Devi Gurung',     face: '👵', district: 'Kaski' },
  { name: 'Bimal Raj Shrestha',    face: '🧑', district: 'Chitwan' },
  { name: 'Sunita Rai',            face: '👩', district: 'Morang' },
  { name: 'Hari Bahadur Karki',    face: '👨', district: 'Sunsari' },
  { name: 'Manita Tamang',         face: '👧', district: 'Nuwakot' },
  { name: 'Ganesh Pd. Poudel',     face: '👴', district: 'Gorkha' },
  { name: 'Saraswati Devi Yadav',  face: '👵', district: 'Siraha' },
  { name: 'Nabin Khadka',          face: '👦', district: 'Rupandehi' },
  { name: 'Puja Magar',            face: '👧', district: 'Palpa' },
  { name: 'Rajendra Prasad Shah',  face: '👨', district: 'Bara' },
  { name: 'Kamala Kumari Tiwari',  face: '👩', district: 'Parsa' },
  { name: 'Dipak Bahadur Rana',    face: '🧑', district: 'Dang' },
  { name: 'Rekha Chaudhary',       face: '👩', district: 'Kailali' },
  { name: 'Bikram Singh Basnet',   face: '👨', district: 'Jumla' },
  { name: 'Gita Limbu',            face: '👧', district: 'Taplejung' },
  { name: 'Suman Ale Magar',       face: '🧑', district: 'Myagdi' },
  { name: 'Savita Pandey',         face: '👩', district: 'Dadeldhura' },
];

function randomVoter(seed: number): VoterProfile {
  const base = VOTER_POOL[seed % VOTER_POOL.length];
  return {
    ...base,
    age: 18 + ((seed * 7 + 13) % 55),
    voterId: `NEC-${String((seed * 3947 + 1021) % 99999).padStart(5, '0')}`,
  };
}

interface Props {
  onEnd: (stats: GameStats) => void;
}

export default function GameScreen({ onEnd }: Props) {
  const [ballots] = useState<BallotData[]>(() => generateBallotQueue(TOTAL_BALLOTS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [stats, setStats] = useState<GameStats>({
    score: 0, correct: 0, incorrect: 0, totalSeen: 0, decisions: [], timeElapsed: 0,
  });
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false, correct: false, message: '',
  });
  const [ballotAnim, setBallotAnim] = useState<'in' | 'out' | 'idle'>('in');
  const [locked, setLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());
  // Always-fresh ref so the end-game effect never captures stale stats
  const statsRef = useRef<GameStats>(stats);
  statsRef.current = stats;
  // Guard so we only call onEnd once
  const gameEndedRef = useRef(false);

  const currentBallot: BallotData | undefined = ballots[currentIdx];
  const done = currentIdx >= ballots.length;
  const voter = useMemo(() => randomVoter(currentIdx), [currentIdx]);

  // Mobile detection
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (done || gameEndedRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [done]);

  // End game — reads stats via ref so it's never stale
  useEffect(() => {
    if ((timeLeft === 0 || done) && !gameEndedRef.current) {
      gameEndedRef.current = true;
      clearInterval(timerRef.current!);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      // Small delay so any in-flight feedback animation finishes
      setTimeout(() => {
        onEnd({ ...statsRef.current, timeElapsed: elapsed });
      }, 700);
    }
  }, [timeLeft, done, onEnd]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (locked) return;
      if (e.key === 'v' || e.key === 'V') decide('valid');
      if (e.key === 'i' || e.key === 'I') decide('invalid');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const decide = useCallback((decision: 'valid' | 'invalid') => {
    if (locked || !currentBallot || done || timeLeft === 0 || gameEndedRef.current) return;
    setLocked(true);

    const correct = decision === (currentBallot.isValid ? 'valid' : 'invalid');
    const timeDelta = correct ? CORRECT_BONUS : -WRONG_PENALTY;
    const scoreDelta = correct ? 10 : -5;

    const d: PlayerDecision = {
      ballotId: currentBallot.id,
      decision,
      correct,
      invalidReason: currentBallot.invalidReason,
    };

    setStats((s) => ({
      ...s,
      score: Math.max(0, s.score + scoreDelta),
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
      totalSeen: s.totalSeen + 1,
      decisions: [...s.decisions, d],
    }));

    setTimeLeft((t) => Math.max(0, Math.min(INITIAL_TIME, t + timeDelta)));

    setFeedback({
      show: true,
      correct,
      message: correct ? '' : (currentBallot.invalidReasonDisplay ?? ''),
    });
  }, [locked, currentBallot, done, timeLeft]);

  const handleFeedbackDone = useCallback(() => {
    setFeedback({ show: false, correct: false, message: '' });
    setBallotAnim('out');
    setTimeout(() => {
      setCurrentIdx((i) => i + 1);
      setBallotAnim('in');
      setLocked(false);
    }, 400);
  }, []);

  const accuracy = stats.totalSeen > 0 ? Math.round((stats.correct / stats.totalSeen) * 100) : 0;

  const statsItems = [
    { label: 'SCORE',    value: String(stats.score),    color: '#d4b030' },
    { label: 'CORRECT',  value: String(stats.correct),  color: '#2a9a2a' },
    { label: 'WRONG',    value: String(stats.incorrect), color: '#ee4444' },
    { label: 'ACC.',     value: `${accuracy}%`,         color: '#c8b89a' },
  ];

  const btnDisabled = locked || done || timeLeft === 0;

  return (
    <div className="h-screen w-screen desk-surface flex flex-col overflow-hidden relative">
      <div className="scanlines" />

      {/* ── Desktop Top bar ── */}
      <div
        className="hidden md:flex items-center justify-between px-5 py-3 shrink-0"
        style={{ background: 'rgba(15,8,5,0.97)', borderBottom: '1px solid rgba(184,150,12,0.25)' }}
      >
        <div className="flex items-center gap-3">
          <GiStamper size={22} style={{ color: '#b8960c' }} />
          <div>
            <p className="font-typewriter tracking-widest uppercase" style={{ color: '#b8960c', fontSize: '0.72rem' }}>
              Election Commission · Nepal
            </p>
            <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.65rem' }}>
              Ballot Validation Station
            </p>
          </div>
        </div>

        <div style={{ minWidth: 160 }}>
          <Timer timeLeft={timeLeft} totalTime={INITIAL_TIME} />
        </div>

        <div className="flex items-center gap-5">
          {statsItems.map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.65rem', letterSpacing: '0.08em' }}>{label}</p>
              <p className="font-mono font-bold" style={{ color, fontSize: '1.25rem', lineHeight: 1 }}>{value}</p>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <FiFileText size={14} style={{ color: '#5a4a3a' }} />
            <span className="font-typewriter" style={{ fontSize: '0.8rem', color: '#7a6a5a' }}>
              {Math.min(currentIdx + 1, ballots.length)}/{ballots.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile Top bar ── */}
      <div
        className="flex md:hidden flex-col shrink-0"
        style={{ background: 'rgba(15,8,5,0.97)', borderBottom: '1px solid rgba(184,150,12,0.25)' }}
      >
        {/* Row 1: brand | timer | count */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1 gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <GiStamper size={15} style={{ color: '#b8960c' }} />
            <p className="font-typewriter tracking-widest uppercase" style={{ color: '#b8960c', fontSize: '0.58rem' }}>
              Ballot Inspector
            </p>
          </div>
          <div style={{ minWidth: 110 }}>
            <Timer timeLeft={timeLeft} totalTime={INITIAL_TIME} />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <FiFileText size={11} style={{ color: '#5a4a3a' }} />
            <span className="font-typewriter" style={{ fontSize: '0.66rem', color: '#7a6a5a' }}>
              {Math.min(currentIdx + 1, ballots.length)}/{ballots.length}
            </span>
          </div>
        </div>
        {/* Row 2: stats */}
        <div className="flex items-center justify-center gap-5 px-3 pb-2">
          {statsItems.map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.46rem', letterSpacing: '0.05em' }}>{label}</p>
              <p className="font-mono font-bold" style={{ color, fontSize: '0.88rem', lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile Voter Strip ── */}
      <div
        className="flex md:hidden shrink-0 items-center gap-3 px-3 py-2"
        style={{ background: 'rgba(20,12,5,0.95)', borderBottom: '1px solid rgba(184,150,12,0.15)' }}
      >
        <div
          style={{
            fontSize: '1.85rem', lineHeight: 1,
            filter: 'grayscale(1) brightness(0.72) contrast(1.1)',
            userSelect: 'none', flexShrink: 0,
          }}
        >
          {voter.face}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-typewriter font-bold truncate" style={{ color: '#d4c8b0', fontSize: '0.66rem' }}>
            {voter.name}
          </p>
          <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.54rem' }}>
            Age {voter.age} · {voter.district}
          </p>
        </div>
        <div
          className="rounded px-2 py-1 shrink-0"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="font-mono" style={{ color: '#4a3a28', fontSize: '0.5rem', letterSpacing: '0.08em' }}>
            {voter.voterId}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <FiUser size={9} style={{ color: '#5a4a3a' }} />
          <span className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.5rem' }}>VOTER</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden md:gap-4 md:p-4">

        {/* Left sidebar — desktop only */}
        <div className="hidden md:flex shrink-0 flex-col gap-3" style={{ width: 260 }}>
          <RulesReference />

          {/* Ballot progress tracker */}
          <div
            className="px-3 py-3 rounded"
            style={{ background: 'rgba(15,8,5,0.85)', border: '1px solid rgba(184,150,12,0.18)' }}
          >
            <p className="font-typewriter mb-2" style={{ color: '#5a4a3a', fontSize: '0.68rem', letterSpacing: '0.1em' }}>
              BALLOT QUEUE
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: ballots.length }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 10, height: 13,
                    background: i < currentIdx
                      ? (stats.decisions[i]?.correct ? 'rgba(0,120,0,0.65)' : 'rgba(180,0,0,0.55)')
                      : i === currentIdx
                      ? '#b8960c'
                      : 'rgba(255,255,255,0.07)',
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center — ballot */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto overflow-x-hidden py-2 md:py-0 md:justify-center">
          {currentBallot && !gameEndedRef.current && (
            <div
              className={`w-full px-2 md:px-0 ${
                ballotAnim === 'in' ? 'animate-slideIn' : ballotAnim === 'out' ? 'animate-slideOut' : ''
              }`}
              style={{ position: 'relative', maxWidth: 460 }}
            >
              <BallotDisplay ballot={currentBallot} compact={isMobile} />
              <FeedbackOverlay
                show={feedback.show}
                correct={feedback.correct}
                message={feedback.message}
                onDone={handleFeedbackDone}
              />
            </div>
          )}

          <p className="hidden md:block font-typewriter mt-3" style={{ color: '#4a3a28', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
            Press [V] for VALID · [I] for INVALID
          </p>
        </div>

        {/* Right sidebar — desktop only */}
        <div className="hidden md:flex shrink-0 flex-col items-center gap-4" style={{ width: 200 }}>

          {/* Voter ID card */}
          <div
            className="w-full rounded"
            style={{
              background: 'rgba(20, 12, 5, 0.92)',
              border: '1px solid rgba(184,150,12,0.3)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              overflow: 'hidden',
            }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5"
              style={{ background: 'rgba(184,150,12,0.1)', borderBottom: '1px solid rgba(184,150,12,0.2)' }}
            >
              <FiUser size={10} style={{ color: '#b8960c' }} />
              <span className="font-typewriter tracking-widest uppercase" style={{ color: '#b8960c', fontSize: '0.58rem' }}>
                VOTER PRESENTING
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 px-3 py-3 mt-5">
              <div
                style={{
                  fontSize: '3.8rem',
                  lineHeight: 1,
                  filter: 'grayscale(1) brightness(0.72) contrast(1.1)',
                  userSelect: 'none',
                }}
              >
                {voter.face}
              </div>

              <div className="text-center w-full">
                <p
                  className="font-typewriter font-bold leading-tight"
                  style={{ color: '#d4c8b0', fontSize: '0.72rem', wordBreak: 'break-word' }}
                >
                  {voter.name}
                </p>
                <p className="font-typewriter mt-0.5" style={{ color: '#5a4a3a', fontSize: '0.6rem' }}>
                  Age {voter.age} · {voter.district}
                </p>
              </div>

              <div
                className="w-full text-center rounded px-2 py-1"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <p className="font-mono" style={{ color: '#4a3a28', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                  {voter.voterId}
                </p>
              </div>
            </div>
          </div>

          <p className="font-typewriter" style={{ color: '#5a4a3a', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
            YOUR VERDICT
          </p>

          {/* VALID */}
          <button
            className="stamp-btn-valid rounded w-full flex flex-col items-center gap-3 py-7 px-3"
            onClick={() => decide('valid')}
            disabled={btnDisabled}
            style={{ opacity: btnDisabled ? 0.45 : 1, cursor: btnDisabled ? 'not-allowed' : 'pointer' }}
          >
            <FiCheckCircle size={44} />
            <span style={{ fontSize: '1.4rem', letterSpacing: '0.22em' }}>VALID</span>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', opacity: 0.75, fontFamily: "'Noto Sans Devanagari', serif" }}>
              मान्य मतपत्र
            </span>
            <span style={{ fontSize: '0.62rem', opacity: 0.4 }}>[V]</span>
          </button>

          <div style={{ width: '55%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* INVALID */}
          <button
            className="stamp-btn-invalid rounded w-full flex flex-col items-center gap-3 py-7 px-3"
            onClick={() => decide('invalid')}
            disabled={btnDisabled}
            style={{ opacity: btnDisabled ? 0.45 : 1, cursor: btnDisabled ? 'not-allowed' : 'pointer' }}
          >
            <FiXCircle size={44} />
            <span style={{ fontSize: '1.4rem', letterSpacing: '0.22em' }}>INVALID</span>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', opacity: 0.75, fontFamily: "'Noto Sans Devanagari', serif" }}>
              अमान्य मतपत्र
            </span>
            <span style={{ fontSize: '0.62rem', opacity: 0.4 }}>[I]</span>
          </button>

          <div className="text-center">
            <p className="font-typewriter" style={{ color: '#3a2a18', fontSize: '0.62rem', lineHeight: 1.8 }}>
              ✓ correct: <span style={{ color: '#22cc44' }}>+{CORRECT_BONUS}s</span><br />
              ✗ wrong: <span style={{ color: '#ee3333' }}>−{WRONG_PENALTY}s</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile verdict buttons ── */}
      <div
        className="flex md:hidden shrink-0"
        style={{ borderTop: '1px solid rgba(184,150,12,0.18)', background: 'rgba(10,5,2,0.97)' }}
      >
        <button
          className="flex-1 flex flex-col items-center gap-1 py-3 font-typewriter font-bold tracking-widest uppercase select-none transition-all duration-150 active:scale-95"
          onClick={() => decide('valid')}
          disabled={btnDisabled}
          style={{
            color: '#22cc44',
            background: btnDisabled ? 'rgba(34,204,68,0.03)' : 'rgba(34,204,68,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            opacity: btnDisabled ? 0.45 : 1,
            cursor: btnDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <FiCheckCircle size={26} />
          <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>VALID</span>
          <span style={{ fontSize: '0.56rem', fontFamily: "'Noto Sans Devanagari', serif", opacity: 0.7 }}>मान्य मतपत्र</span>
        </button>
        <button
          className="flex-1 flex flex-col items-center gap-1 py-3 font-typewriter font-bold tracking-widest uppercase select-none transition-all duration-150 active:scale-95"
          onClick={() => decide('invalid')}
          disabled={btnDisabled}
          style={{
            color: '#ee3333',
            background: btnDisabled ? 'rgba(238,51,51,0.03)' : 'rgba(238,51,51,0.08)',
            opacity: btnDisabled ? 0.45 : 1,
            cursor: btnDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <FiXCircle size={26} />
          <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>INVALID</span>
          <span style={{ fontSize: '0.56rem', fontFamily: "'Noto Sans Devanagari', serif", opacity: 0.7 }}>अमान्य मतपत्र</span>
        </button>
      </div>

      {/* ── Bottom status bar — wrong decision counter ── */}
      <div
        className="shrink-0 flex items-center justify-center gap-3 px-5 py-1.5"
        style={{ background: 'rgba(10,5,2,0.97)', borderTop: '1px solid rgba(184,150,12,0.12)' }}
      >
        <span className="font-typewriter" style={{ color: '#3a2a18', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          WRONG DECISIONS:
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.max(stats.incorrect, 1) }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: i < stats.incorrect ? '#ee3333' : 'rgba(255,255,255,0.06)',
                boxShadow: i < stats.incorrect ? '0 0 4px rgba(238,51,51,0.5)' : 'none',
              }}
            />
          ))}
        </div>
        <span
          className="font-mono font-bold"
          style={{ color: stats.incorrect > 0 ? '#ee3333' : '#3a2a18', fontSize: '0.85rem', minWidth: 18 }}
        >
          {stats.incorrect}
        </span>
        {stats.incorrect > 0 && (
          <span className="font-typewriter" style={{ color: '#5a2a2a', fontSize: '0.62rem' }}>
            (−{stats.incorrect * WRONG_PENALTY}s penalty)
          </span>
        )}
      </div>

      {/* Creator credit — desktop only, bottom-right corner */}
      <a
        href="https://www.animeshbasnet.com.np/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex absolute bottom-3 right-4 group items-center gap-2"
        style={{ zIndex: 50 }}
      >
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
          style={{ color: '#b8960c', fontSize: '0.78rem' }}
        >
          Created by Crypticsy
        </span>
        <img
          src="https://github.com/crypticsy.png"
          alt="Crypticsy"
          className="rounded-full transition-opacity duration-200 opacity-70 group-hover:opacity-100"
          style={{ width: 42, height: 42, border: '2px solid rgba(184,150,12,0.0)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(184,150,12,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(184,150,12,0.0)')}
        />
      </a>
    </div>
  );
}
