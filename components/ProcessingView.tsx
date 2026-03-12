"use client";

export default function ProcessingView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        gap: 32,
      }}
    >
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid rgba(0, 230, 0, 0.15)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid transparent",
            borderTopColor: "#00e600",
            borderRadius: "50%",
            animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            border: "2px solid transparent",
            borderTopColor: "#00a000",
            borderRadius: "50%",
            animation: "spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse",
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#e8e4df",
            fontSize: 18,
            margin: "0 0 8px 0",
          }}
        >
          문장을 읽고 있어요
        </p>
        <p
          style={{
            color: "#888",
            fontSize: 13,
            margin: 0,
          }}
        >
          띄어쓰기 보정 및 문장 분리 중...
        </p>
      </div>
    </div>
  );
}
