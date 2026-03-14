"use client";

import { useRef, useEffect, useState } from "react";

interface CameraViewProps {
  error: string | null;
  onImageCapture: (dataUrl: string) => void;
}

export default function CameraView({ error, onImageCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", aspectRatio: 4 / 3 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError("카메라 접근 권한이 필요해요.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleShoot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    onImageCapture(canvas.toDataURL("image/jpeg", 0.9));
  };

  const handleGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => onImageCapture(ev.target?.result as string);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100svh - 115px)",
        animation: "fadeIn 0.4s ease",
      }}
    >
      {/* 카메라 뷰파인더 — 그라디언트 border */}
      <div
        style={{
          width: "100%",
          padding: 1,
          borderRadius: 9,
          background:
            "linear-gradient(173deg, rgba(255,255,255,0.5) 0%, rgba(186,186,186,0.5) 100%)",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "342 / 303",
            borderRadius: 8,
            overflow: "hidden",
            background: "#000000",
            position: "relative",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: cameraReady ? "block" : "none",
            }}
          />

          {!cameraReady && !cameraError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "#444", fontSize: 13 }}>카메라 준비 중...</p>
            </div>
          )}

          {cameraError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 24,
              }}
            >
              <p style={{ color: "#c47a6a", fontSize: 14, textAlign: "center" }}>{cameraError}</p>
              <p style={{ color: "#555", fontSize: 12, textAlign: "center" }}>갤러리에서 사진을 선택해주세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 팁 + API 에러 */}
      <p
        style={{
          color: error ? "#c47a6a" : "#b4b4b4",
          fontSize: 12,
          fontWeight: 300,
          textAlign: "center",
          letterSpacing: "-0.24px",
          lineHeight: "18px",
          whiteSpace: "nowrap",
        }}
      >
        {error ?? "페이지를 평평하게 펴고, 그림자가 지지 않게 촬영하세요."}
      </p>

      {/* 스페이서 — 버튼을 하단으로 밀기 */}
      <div style={{ flex: 1 }} />

      {/* 촬영 버튼 — 그라디언트 border + 그라디언트 fill */}
      <div
        style={{
          width: 170,
          padding: 1,
          borderRadius: 28,
          background: cameraReady
            ? "linear-gradient(180deg, #1EFF00 0%, #13A600 100%)"
            : "linear-gradient(180deg, #333 0%, #222 100%)",
          boxShadow: "2px 2px 4px 0 rgba(0,0,0,0.60)",
        }}
      >
        <button
          onClick={handleShoot}
          disabled={!cameraReady}
          style={{
            width: "100%",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: cameraReady
              ? "linear-gradient(96deg, #B4FFAA 0%, #1EFF00 51.92%, #B4FFAA 100%)"
              : "#1a1a1a",
            border: "none",
            borderRadius: 27,
            cursor: cameraReady ? "pointer" : "default",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ filter: cameraReady ? "drop-shadow(0 0 2px #17ca00)" : "none" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={cameraReady ? "#000" : "#333"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </button>
      </div>

      {/* 갤러리 버튼 — 그라디언트 border + 흰색→회색 그라디언트 */}
      <div
        style={{
          marginTop: 8,
          width: 170,
          padding: 1,
          borderRadius: 28,
          background: "linear-gradient(180deg, #FFF 0%, #BABABA 100%)",
          boxShadow: "2px 2px 4px 0 rgba(0,0,0,0.60)",
        }}
      >
        <button
          onClick={handleGallery}
          style={{
            width: "100%",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(96deg, #FFF 0%, #CCC 100%)",
            border: "none",
            borderRadius: 27,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
      </div>

      {/* 하단 여백 (copyright footer 공간 확보) */}
      <div style={{ height: 48 }} />
    </div>
  );
}
