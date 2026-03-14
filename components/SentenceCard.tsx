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
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        paddingTop: 21,
        paddingBottom: 21,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        userSelect: "none",
        animation: `fadeSlideIn 0.4s ease ${index * 0.06}s both`,
      }}
    >
      {/* Checkbox */}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {selected ? (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.33333 11L12.2083 5.125L11.0417 3.95833L6.33333 8.66667L3.95833 6.29167L2.79167 7.45833L6.33333 11ZM1.66667 15C1.20833 15 0.816111 14.8369 0.49 14.5108C0.163889 14.1847 0.000555556 13.7922 0 13.3333V1.66667C0 1.20833 0.163333 0.816111 0.49 0.49C0.816667 0.163889 1.20889 0.000555556 1.66667 0H13.3333C13.7917 0 14.1842 0.163333 14.5108 0.49C14.8375 0.816667 15.0006 1.20889 15 1.66667V13.3333C15 13.7917 14.8369 14.1842 14.5108 14.5108C14.1847 14.8375 13.7922 15.0006 13.3333 15H1.66667Z" fill="#1EFF00"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="14" height="14" rx="1.5" stroke="#B4B4B4"/>
          </svg>
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "130%",
          letterSpacing: "-0.32px",
          color: "#B4B4B4",
          wordBreak: "keep-all",
        }}
      >
        {sentence}
      </p>
    </div>
  );
}
