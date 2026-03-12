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
        gap: 16,
        animation: "fadeIn 0.4s ease",
      }}
    >
      {/* 카메라 프레임 */}
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: 20,
          overflow: "hidden",
          background: cameraReady ? "#000" : "#1a1a1a",
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

      {/* API 에러 */}
      {error && (
        <p style={{ color: "#c47a6a", fontSize: 13, textAlign: "center" }}>{error}</p>
      )}

      {/* 촬영 버튼 */}
      <button
        onClick={handleShoot}
        disabled={!cameraReady}
        style={{
          width: "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: cameraReady ? "#00e600" : "#1a1a1a",
          border: "none",
          borderRadius: 100,
          padding: "16px 0",
          cursor: cameraReady ? "pointer" : "default",
          transition: "all 0.2s ease",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cameraReady ? "#000" : "#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>

      {/* 갤러리 버튼 */}
      <button
        onClick={handleGallery}
        style={{
          width: "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "1.5px solid #00e600",
          borderRadius: 100,
          padding: "14px 0",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00e600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>

      {/* 촬영 팁 */}
      <p
        style={{
          color: "#555",
          fontSize: 13,
          textAlign: "center",
          lineHeight: 1.7,
          marginTop: 8,
        }}
      >
        페이지를 평평하게 펴고
        <br />
        그림자가 지지 않게 촬영하면
        <br />
        인식률이 높아집니다.
      </p>
    </div>
  );
}
