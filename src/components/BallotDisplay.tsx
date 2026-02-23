import type { BallotData } from '../types';
import { PARTY_SYMBOLS, COLS, ROWS } from '../data/parties';

interface Props {
  ballot: BallotData;
  compact?: boolean; // true on mobile — smaller cells & fonts
}

const BALLOT_W    = 460;
const CELL_H      = 52;
const CELL_H_SM   = 38;

export default function BallotDisplay({ ballot, compact = false }: Props) {
  const cellH = compact ? CELL_H_SM : CELL_H;

  const markMap = new Map<string, { isBorder?: boolean; borderDir?: string; sloppy?: boolean }>();
  for (const mark of ballot.marks) {
    markMap.set(`${mark.row}-${mark.col}`, {
      isBorder: mark.isBorder,
      borderDir: mark.borderDir,
      sloppy: ballot.sloppyMark,
    });
  }

  const renderMark = (sloppy?: boolean, borderDir?: string, isBorder?: boolean) => {
    if (isBorder && borderDir === 'right')   return <span className="vote-mark-border-right">✓</span>;
    if (isBorder && borderDir === 'bottom')  return <span className="vote-mark-border-bottom">✓</span>;
    return <span className={`vote-mark ${sloppy ? 'vote-mark-sloppy' : ''}`}>✓</span>;
  };

  return (
    <div
      className="ballot-paper rounded shadow-ballot mx-auto select-none"
      style={{ width: '100%', maxWidth: BALLOT_W, position: 'relative', overflow: 'hidden' }}
    >
      {/* Torn corners */}
      {ballot.hasTear && ballot.tearPosition === 'top-right'    && <div className="torn-corner-tr" />}
      {ballot.hasTear && ballot.tearPosition === 'bottom-right' && <div className="torn-corner-br" />}
      {ballot.hasTear && ballot.tearPosition === 'top-left'     && <div className="torn-corner-tl" />}

      {/* Identifying text */}
      {ballot.identifyingText && ballot.identifyingPos && (
        <span
          className="identifying-text"
          style={{ top: ballot.identifyingPos.top, left: ballot.identifyingPos.left }}
        >
          {ballot.identifyingText}
        </span>
      )}

      {/* Header */}
      <div
        className="text-center py-2 px-3"
        style={{ fontFamily: "'Noto Sans Devanagari', serif", borderBottom: '2px solid #1a1208' }}
      >
        <p className="font-bold leading-snug" style={{ fontSize: compact ? '0.65rem' : '0.85rem', color: '#1a1208' }}>
          प्रतिनिधि सभा सदस्य निर्वाचन, २०७९
        </p>
        <p className="leading-snug" style={{ fontSize: compact ? '0.58rem' : '0.75rem', color: '#1a1208' }}>
          समानुपातिक निर्वाचन प्रणालीको मतपत्र
        </p>
        <p className="font-semibold" style={{ fontSize: compact ? '0.55rem' : '0.72rem', color: '#1a1208', marginTop: 2 }}>
          एउटा कोठामित्र मात्र मतरसङ्केत (✓) गर्नुहोस्
        </p>
      </div>

      {/* Symbol grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          border: '1.5px solid #1a1208',
          borderTop: 'none',
          margin: '0 3px',
        }}
      >
        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => {
            const symbolIndex = row * COLS + col;
            const symbol = PARTY_SYMBOLS[symbolIndex];
            const key = `${row}-${col}`;
            const mark = markMap.get(key);
            const isLastRowEmpty = row === ROWS - 1 && col >= 3;

            if (isLastRowEmpty || !symbol) {
              return (
                <div
                  key={key}
                  style={{
                    borderRight: col < COLS - 1 ? '1px solid #1a1208' : 'none',
                    borderBottom: row < ROWS - 1 ? '1px solid #1a1208' : 'none',
                    height: cellH,
                    background: isLastRowEmpty ? 'rgba(0,0,0,0.03)' : undefined,
                  }}
                />
              );
            }

            return (
              <div
                key={key}
                style={{
                  position: 'relative',
                  height: cellH,
                  borderRight: col < COLS - 1 ? '1px solid #1a1208' : 'none',
                  borderBottom: row < ROWS - 1 ? '1px solid #1a1208' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: mark?.isBorder ? 'visible' : 'hidden',
                }}
              >
                <span className="party-symbol">{symbol.icon}</span>
                {mark && renderMark(mark.sloppy, mark.borderDir, mark.isBorder)}
              </div>
            );
          })
        )}
      </div>

      {/* Signature area */}
      <div
        className="flex items-center px-3"
        style={{
          borderTop: '1.5px solid #1a1208',
          margin: '0 3px',
          fontFamily: "'Noto Sans Devanagari', serif",
          minHeight: compact ? 26 : 34,
          paddingTop: compact ? 3 : 6,
          paddingBottom: compact ? 3 : 6,
        }}
      >
        <span style={{ fontSize: compact ? '0.58rem' : '0.72rem', color: '#1a1208', whiteSpace: 'nowrap' }}>
          मतदान अधिकृतको दस्तखत :
        </span>
        <div
          style={{
            flex: 1,
            borderBottom: ballot.hasSignature ? '1px solid #1a1208' : '1px dashed rgba(80,20,20,0.35)',
            marginLeft: 8,
            height: compact ? 16 : 22,
            position: 'relative',
          }}
        >
          {ballot.hasSignature ? (
            <span
              style={{
                position: 'absolute',
                bottom: 1,
                left: 4,
                fontSize: compact ? '0.6rem' : '0.78rem',
                fontFamily: 'Courier Prime, cursive',
                color: '#1a1208',
                fontStyle: 'italic',
                opacity: 0.85,
                transform: 'rotate(-2deg)',
                display: 'inline-block',
              }}
            >
              / <span style={{ fontFamily: 'serif', letterSpacing: '-0.5px' }}>निर्वाचन अधिकृत</span>
            </span>
          ) : (
            <span style={{ position: 'absolute', bottom: 2, left: 4, fontSize: '0.62rem', fontFamily: 'Courier Prime, monospace', color: 'rgba(160,30,30,0.45)', letterSpacing: '0.05em' }}>
              — — —
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
