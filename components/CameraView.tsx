"use client";

import { useRef } from "react";

interface CameraViewProps {
  error: string | null;
  onCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CameraView({ error, onCapture }: CameraViewProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = onCapture as unknown as (e: Event) => void;
    input.click();
  };

  const corners = [
    { top: 16, left: 16 },
    { top: 16, right: 16 },
    { bottom: 16, left: 16 },
    { bottom: 16, right: 16 },
  ] as const;

  const cornerBorders = [
    { borderTopWidth: 2, borderLeftWidth: 2 },
    { borderTopWidth: 2, borderRightWidth: 2 },
    { borderBottomWidth: 2, borderLeftWidth: 2 },
    { borderBottomWidth: 2, borderRightWidth: 2 },
  ];

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* 가이드 프레임 */}
        <div
          style={{
            width: "100%",
            aspectRatio: "3 / 4",
            border: "1px solid rgba(107, 154, 91, 0.2)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            background: "rgba(255,255,255,0.02)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 코너 마크 */}
          {corners.map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: 24,
                height: 24,
                borderColor: "rgba(107, 154, 91, 0.4)",
                borderStyle: "solid",
                borderWidth: 0,
                ...cornerBorders[i],
              }}
            />
          ))}

          {/* 가이드 텍스트 */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 20px",
                borderRadius: "50%",
                background: "rgba(107, 154, 91, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b9a5b"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="15" y2="12" />
                <line x1="7" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <p
              style={{
                color: "#e8e4df",
                fontSize: 16,
                fontFamily: "'Noto Serif KR', serif",
                fontWeight: 300,
                marginBottom: 8,
              }}
            >
              책 페이지를 촬영해주세요
            </p>
            <p
              style={{
                color: "#777",
                fontSize: 13,
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              AI가 문장을 인식하고
              <br />
              띄어쓰기를 보정해드려요
            </p>
          </div>

          {/* 촬영 팁 */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              padding: "12px 16px",
              background: "rgba(107, 154, 91, 0.08)",
              borderRadius: 8,
              border: "1px solid rgba(107, 154, 91, 0.12)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#6b9a5b",
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: 500,
                marginBottom: 4,
                letterSpacing: "0.05em",
              }}
            >
              촬영 팁
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#888",
                fontFamily: "'Noto Sans KR', sans-serif",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              페이지를 평평하게 펴고, 그림자가 지지 않게 촬영하면 인식률이 높아져요.
            </p>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p
            style={{
              color: "#c47a6a",
              fontSize: 14,
              fontFamily: "'Noto Sans KR', sans-serif",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* 카메라 입력 (촬영하기) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onCapture}
          style={{ display: "none" }}
          id="camera-input"
        />

        {/* 버튼 영역 */}
        <div style={{ display: "flex", gap: 12, width: "100%" }}>
          <label
            htmlFor="camera-input"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "linear-gradient(135deg, #2d5028, #3a6b33)",
              color: "#d4e7c5",
              padding: "16px 24px",
              borderRadius: 100,
              fontSize: 15,
              fontFamily: "'Noto Sans KR', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.03em",
              textAlign: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            촬영하기
          </label>

          <button
            onClick={handleGalleryClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#aaa",
              padding: "16px 24px",
              borderRadius: 100,
              fontSize: 15,
              fontFamily: "'Noto Sans KR', sans-serif",
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
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            갤러리
          </button>
        </div>
      </div>
    </div>
  );
}
