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

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const isAlive = streamRef.current?.getTracks().some((t) => t.readyState === "live");
        if (!isAlive) {
          setCameraReady(false);
          await startCamera();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopCamera();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
          <svg
            width="26.672"
            height="23.996"
            viewBox="0 0 31 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: cameraReady ? 1 : 0.3 }}
          >
            <g filter="url(#cam_shadow)">
              <path d="M15.3347 11.332C13.1663 11.332 11.334 13.1637 11.334 15.3313C11.334 17.4989 13.1663 19.3305 15.3347 19.3305C17.5031 19.3305 19.3355 17.4989 19.3355 15.3313C19.3355 13.1637 17.5031 11.332 15.3347 11.332Z" fill="#181818"/>
              <path d="M26.0045 5.99926H22.5558L18.9458 2.39059C18.6958 2.14057 18.3566 2.00008 18.003 2H12.6686C12.315 2.00008 11.9758 2.14057 11.7258 2.39059L8.1158 5.99926H4.66716C3.19622 5.99926 2 7.19504 2 8.66543V23.3294C2 24.7998 3.19622 25.9955 4.66716 25.9955H26.0045C27.4754 25.9955 28.6716 24.7998 28.6716 23.3294V8.66543C28.6716 7.19504 27.4754 5.99926 26.0045 5.99926ZM15.3358 21.9963C11.7218 21.9963 8.6679 18.9435 8.6679 15.3309C8.6679 11.7182 11.7218 8.66543 15.3358 8.66543C18.9498 8.66543 22.0037 11.7182 22.0037 15.3309C22.0037 18.9435 18.9498 21.9963 15.3358 21.9963Z" fill="#181818"/>
            </g>
            <defs>
              <filter id="cam_shadow" x="0" y="0" width="30.6716" height="27.9955" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="1"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.0926401 0 0 0 0 0.794058 0 0 0 0 0 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_14"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_14" result="shape"/>
              </filter>
            </defs>
          </svg>
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
            width="25"
            height="25"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#gallery_shadow)">
              <path d="M4.77778 27C4.01389 27 3.36019 26.7282 2.81667 26.1847C2.27315 25.6412 2.00093 24.987 2 24.2222V4.77778C2 4.01389 2.27222 3.36019 2.81667 2.81667C3.36111 2.27315 4.01481 2.00093 4.77778 2H24.2222C24.9861 2 25.6403 2.27222 26.1847 2.81667C26.7292 3.36111 27.0009 4.01481 27 4.77778V24.2222C27 24.9861 26.7282 25.6403 26.1847 26.1847C25.6412 26.7292 24.987 27.0009 24.2222 27H4.77778ZM6.16667 21.4444H22.8333L17.625 14.5L13.4583 20.0556L10.3333 15.8889L6.16667 21.4444Z" fill="#424242"/>
            </g>
            <defs>
              <filter id="gallery_shadow" x="0" y="0" width="29" height="29" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="1"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.652212 0 0 0 0 0.652212 0 0 0 0 0.652212 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_17"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_17" result="shape"/>
              </filter>
            </defs>
          </svg>
        </button>
      </div>

      {/* copyright — 갤러리 버튼 87px 아래 */}
      <p
        style={{
          marginTop: 87,
          color: "#676767",
          textAlign: "center",
          fontSize: 10,
          fontWeight: 400,
          lineHeight: "normal",
          letterSpacing: "-0.2px",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        ⓒ 2026. CHOROK All rights reserved.
      </p>
    </div>
  );
}
