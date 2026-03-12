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
  const [toast, setToast] = useState({ message: "", visible: false });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2000);
  }, []);

  const selectedCount = selected.filter(Boolean).length;

  const getSelectedText = () => {
    return sentences.filter((_, i) => selected[i]).join("\n");
  };

  const compressImage = (dataUrl: string, maxWidth = 1600): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
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
    setSelected((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSelectAll = () => {
    const allSelected = selected.every(Boolean);
    setSelected(new Array(sentences.length).fill(!allSelected));
  };

  const handleCopy = async () => {
    const text = getSelectedText();
    const success = await copyToClipboard(text);
    showToast(success ? "클립보드에 복사되었어요" : "복사에 실패했어요");
  };

  const handleRecord = async () => {
    const text = getSelectedText();
    await copyToClipboard(text);
    showToast("클립보드에 복사됐어요 — 노션에 붙여넣기 해주세요");
    setTimeout(() => {
      window.location.href = "notion://";
    }, 800);
  };

  const handleReset = () => {
    setAppState(STATES.CAMERA);
    setSentences([]);
    setSelected([]);
    setCapturedImage(null);
    setError(null);
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#000",
        position: "relative",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          padding: "52px 24px 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {appState === STATES.CAMERA && (
          <>
            {/* 별꽃 아이콘 */}
            <img
              src="/icons/icon.svg"
              width={36}
              height={34}
              alt=""
              style={{ display: "block", margin: "0 auto 10px" }}
            />
            <h1 style={{ fontSize: 18, fontWeight: 500, color: "#00e600", margin: 0 }}>
              초록 문장 스캐너
            </h1>
          </>
        )}

        {appState === STATES.RESULTS && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: 18, fontWeight: 500, color: "#00e600", margin: 0 }}>
              초록 문장 스캐너
            </h1>
            <button
              onClick={handleReset}
              style={{
                background: "transparent",
                border: "1px solid #333",
                color: "#888",
                padding: "7px 14px",
                borderRadius: 100,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              다시 촬영
            </button>
          </div>
        )}

        {appState === STATES.PROCESSING && (
          <h1 style={{ fontSize: 18, fontWeight: 500, color: "#00e600", margin: 0 }}>
            초록 문장 스캐너
          </h1>
        )}
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
            onToggle={handleToggle}
            onSelectAll={handleSelectAll}
          />
        )}
      </main>

      {appState === STATES.RESULTS && (
        <BottomBar
          selectedCount={selectedCount}
          onCopy={handleCopy}
          onRecord={handleRecord}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
