import React from 'react';

interface PerforatedDividerProps {
  theme?: 'ivory' | 'red' | 'dark' | 'paper';
  variant?: 'punch-row' | 'scallop';
  style?: React.CSSProperties;
}

export const PerforatedDivider: React.FC<PerforatedDividerProps> = ({
  theme = 'ivory',
  variant = 'punch-row',
  style,
}) => {
  const isRed = theme === 'red' || theme === 'dark';
  const bgColor = isRed ? '#5A0A0D' : '#F7F2E7';
  const holeColor = isRed ? '#F7F2E7' : '#5A0A0D';

  if (variant === 'scallop') {
    return (
      <div
        className="perforated-scallop-divider"
        style={{
          width: '100%',
          height: '14px',
          backgroundColor: 'transparent',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="14"
          viewBox="0 0 440 14"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0 H440 V14 C430 14 425 6 420 6 C415 6 410 14 400 14 C390 14 385 6 380 6 C375 6 370 14 360 14 C350 14 345 6 340 6 C335 6 330 14 320 14 C310 14 305 6 300 6 C295 6 290 14 280 14 C270 14 265 6 260 6 C255 6 250 14 240 14 C230 14 225 6 220 6 C215 6 210 14 200 14 C190 14 185 6 180 6 C175 6 170 14 160 14 C150 14 145 6 140 6 C135 6 130 14 120 14 C110 14 105 6 100 6 C95 6 90 14 80 14 C70 14 65 6 60 6 C55 6 50 14 40 14 C30 14 25 6 20 6 C15 6 10 14 0 14 Z"
            fill={bgColor}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="perforated-punch-row"
      style={{
        width: '100%',
        height: '24px',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: '0 8px',
        position: 'relative',
        zIndex: 5,
        boxShadow: isRed ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: 14 }).map((_, idx) => (
        <span
          key={idx}
          style={{
            display: 'inline-block',
            width: '14px',
            height: '10px',
            backgroundColor: holeColor,
            borderRadius: '2px',
            boxShadow: isRed ? 'inset 0 1px 2px rgba(0,0,0,0.2)' : 'inset 0 1px 2px rgba(0,0,0,0.4)',
            opacity: 0.95,
          }}
        />
      ))}
    </div>
  );
};
