"use client";

interface BottomBarProps {
  onCopy: () => void;
  onRecord: () => void;
}

export default function BottomBar({ onCopy, onRecord }: BottomBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        padding: "16px 24px",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 20%, #000 100%)",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        {/* 클립보드 복사 버튼 */}
        <button
          onClick={onCopy}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.25)",
            color: "#ccc",
            padding: "14px 16px",
            borderRadius: 12,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          클립보드에 복사
        </button>

        {/* 노션 버튼 */}
        <button
          onClick={onRecord}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#00e600",
            border: "none",
            color: "#000",
            padding: "14px 16px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 5v14M5 5l14 14M19 5v14" />
          </svg>
          노션으로 이동
        </button>
      </div>
    </div>
  );
}
