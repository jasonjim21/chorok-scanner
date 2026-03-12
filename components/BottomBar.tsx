"use client";

interface BottomBarProps {
  selectedCount: number;
  onCopy: () => void;
  onRecord: () => void;
}

export default function BottomBar({ selectedCount, onCopy, onRecord }: BottomBarProps) {
  const visible = selectedCount > 0;

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
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.25s ease",
        zIndex: 100,
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#00e600",
          marginBottom: 12,
        }}
      >
        {selectedCount}개 문장 선택됨
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onCopy}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
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
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 20px rgba(45, 80, 40, 0.3)",
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
            <path d="M12 5v14M5 12h14" />
          </svg>
          초록에 바로 기록
        </button>
      </div>
    </div>
  );
}
