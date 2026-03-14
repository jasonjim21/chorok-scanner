"use client";

import { useState, useCallback } from "react";
import CameraView from "./CameraView";
import ProcessingView from "./ProcessingView";
import ResultsView from "./ResultsView";
import BottomBar from "./BottomBar";
import Toast from "./Toast";
import { copyToClipboard } from "@/lib/clipboard";

const STATES = {
  CAMERA: "camera",
  PROCESSING: "processing",
  RESULTS: "results",
} as const;

type AppState = (typeof STATES)[keyof typeof STATES];

export default function Scanner() {
  const [appState, setAppState] = useState<AppState>(STATES.CAMERA);
  const [sentences, setSentences] = useState<string[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [merged, setMerged] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2000);
  }, []);

  const selectedCount = selected.filter(Boolean).length;

  const getSelectedText = () => {
    if (merged && selectedCount >= 2) {
      return sentences.filter((_, i) => selected[i]).join(" ");
    }
    return sentences.filter((_, i) => selected[i]).join("\n");
  };

  const compressImage = (dataUrl: string, maxWidth = 1200): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = dataUrl;
    });
  };

  const handleImageCapture = async (dataUrl: string) => {
    const compressed = await compressImage(dataUrl);
    const base64Data = compressed.split(",")[1];

    setCapturedImage(compressed);
    setAppState(STATES.PROCESSING);
    setError(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, mediaType: "image/jpeg" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API 오류");
      }

      if (Array.isArray(data.sentences) && data.sentences.length > 0) {
        setSentences(data.sentences);
        setSelected(new Array(data.sentences.length).fill(false));
        setMerged(false);
        setAppState(STATES.RESULTS);
      } else {
        throw new Error("No sentences found");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("텍스트를 인식하지 못했어요. 다시 촬영해주세요.");
      setAppState(STATES.CAMERA);
    }
  };

  const handleToggle = (index: number) => {
    setMerged(false);
    setSelected((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSelectAll = () => {
    setMerged(false);
    const allSelected = selected.every(Boolean);
    setSelected(new Array(sentences.length).fill(!allSelected));
  };

  const handleMerge = () => {
    setMerged((prev) => !prev);
  };

  const handleCopy = async () => {
    const text = getSelectedText();
    if (!text) return;
    const success = await copyToClipboard(text);
    showToast(success ? "클립보드에 복사되었어요" : "복사에 실패했어요");
  };

  const handleRecord = async () => {
    const text = getSelectedText();
    if (text) await copyToClipboard(text);
    showToast("클립보드에 복사됐어요 — 노션에 붙여넣기 해주세요");
    setTimeout(() => {
      window.location.href = "notion://";
    }, 800);
  };

  const handleReset = () => {
    setAppState(STATES.CAMERA);
    setSentences([]);
    setSelected([]);
    setMerged(false);
    setCapturedImage(null);
    setError(null);
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#111111",
        position: "relative",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          padding: "40px 24px 16px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src="/icons/icon.svg"
          alt=""
          style={{
            display: "block",
            margin: "0 auto",
            width: 42,
            height: 39,
            aspectRatio: "42 / 39",
          }}
        />
      </header>

      {/* 메인 콘텐츠 */}
      <main
        style={{
          padding: "0 20px 140px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: appState === STATES.CAMERA ? "block" : "none" }}>
          <CameraView error={error} onImageCapture={handleImageCapture} />
        </div>

        {appState === STATES.PROCESSING && <ProcessingView />}

        {appState === STATES.RESULTS && (
          <ResultsView
            sentences={sentences}
            selected={selected}
            capturedImage={capturedImage}
            merged={merged}
            onToggle={handleToggle}
            onSelectAll={handleSelectAll}
            onMerge={handleMerge}
            onRetake={handleReset}
          />
        )}
      </main>

      {appState === STATES.RESULTS && (
        <BottomBar onCopy={handleCopy} onRecord={handleRecord} />
      )}

      {appState === STATES.CAMERA && (
        <footer
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 480,
            textAlign: "center",
            paddingBottom: "max(24px, env(safe-area-inset-bottom))",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <p style={{ color: "#676767", fontSize: 10, letterSpacing: "-0.02em" }}>ⓒ 2026. CHOROK All rights reserved.</p>
        </footer>
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
