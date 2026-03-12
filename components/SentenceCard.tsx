"use client";

interface SentenceCardProps {
  sentence: string;
  index: number;
  selected: boolean;
  onToggle: (index: number) => void;
}

export default function SentenceCard({ sentence, index, selected, onToggle }: SentenceCardProps) {
  return (
    <div
      onClick={() => onToggle(index)}
      style={{
        position: "relative",
        padding: "16px 20px 16px 52px",
        background: selected ? "rgba(0, 230, 0, 0.08)" : "rgba(255,255,255,0.03)",
        borderLeft: selected ? "3px solid #00e600" : "3px solid transparent",
        borderRadius: 4,
        transition: "all 0.2s ease",
        cursor: "pointer",
        animation: `fadeSlideIn 0.4s ease ${index * 0.06}s both`,
        userSelect: "none",
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          position: "absolute",
          left: 18,
          top: "50%",
          transform: "translateY(-50%)",
          width: 22,
          height: 22,
          borderRadius: 6,
          border: selected ? "2px solid #00e600" : "2px solid rgba(255,255,255,0.15)",
          background: selected ? "rgba(0, 230, 0, 0.2)" : "transparent",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {selected && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00e600"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 15.5,
          lineHeight: 1.85,
          color: selected ? "#e8e4df" : "#c0bdb8",
          fontFamily: "'Noto Serif KR', serif",
          wordBreak: "keep-all",
          letterSpacing: "0.01em",
          transition: "color 0.2s ease",
        }}
      >
        {sentence}
      </p>
    </div>
  );
}
