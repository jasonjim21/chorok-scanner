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
        video: {
          facingMode: "environment",
          aspectRatio: 3 / 4,
        },
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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    onImageCapture(dataUrl);
  };

  const handleGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        stopCamera();
        onImageCapture(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const corners = [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
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
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* 카메라 프레임 */}
        <div
          style={{
            width: "100%",
            aspectRatio: "3 / 4",
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
            background: "#000",
          }}
        >
          {/* 카메라 스트림 */}
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

          {/* 카메라 로딩 중 */}
          {!cameraReady && !cameraError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0a150a",
              }}
            >
              <p
                style={{
                  color: "#6b9a5b",
                  fontSize: 13,
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}
              >
                카메라 준비 중...
              </p>
            </div>
          )}

          {/* 카메라 권한 오류 */}
          {cameraError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                background: "#0a150a",
                padding: 24,
              }}
            >
              <p
                style={{
                  color: "#c47a6a",
                  fontSize: 14,
                  fontFamily: "'Noto Sans KR', sans-serif",
                  textAlign: "center",
                }}
              >
                {cameraError}
              </p>
              <p
                style={{
                  color: "#666",
                  fontSize: 12,
                  fontFamily: "'Noto Sans KR', sans-serif",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                갤러리에서 사진을 선택해주세요.
              </p>
            </div>
          )}

          {/* 코너 마크 오버레이 */}
          {cameraReady &&
            corners.map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  ...pos,
                  width: 28,
                  height: 28,
                  borderColor: "rgba(107, 154, 91, 0.7)",
                  borderStyle: "solid",
                  borderWidth: 0,
                  ...cornerBorders[i],
                  margin: 12,
                }}
              />
            ))}

          {/* 촬영 팁 오버레이 */}
          {cameraReady && (
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                padding: "10px 14px",
                background: "rgba(0,0,0,0.5)",
                borderRadius: 8,
                backdropFilter: "blur(4px)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(107, 154, 91, 0.9)",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  marginBottom: 2,
                  letterSpacing: "0.05em",
                }}
              >
                촬영 팁
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  lineHeight: 1.5,
                }}
              >
                페이지를 평평하게 펴고, 그림자가 지지 않게 촬영하면 인식률이 높아져요.
              </p>
            </div>
          )}
        </div>

        {/* API 에러 메시지 */}
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

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 12, width: "100%" }}>
          <button
            onClick={handleShoot}
            disabled={!cameraReady}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: cameraReady
                ? "linear-gradient(135deg, #2d5028, #3a6b33)"
                : "rgba(255,255,255,0.05)",
              border: "none",
              color: cameraReady ? "#d4e7c5" : "#555",
              padding: "16px 24px",
              borderRadius: 100,
              fontSize: 15,
              fontFamily: "'Noto Sans KR', sans-serif",
              cursor: cameraReady ? "pointer" : "default",
              transition: "all 0.2s ease",
              letterSpacing: "0.03em",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            촬영하기
          </button>

          <button
            onClick={handleGallery}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
