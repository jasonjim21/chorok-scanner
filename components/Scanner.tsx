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
        height: appState === STATES.CAMERA ? "100svh" : "auto",
        minHeight: "100vh",
        overflow: appState === STATES.CAMERA ? "hidden" : "visible",
        background: "#111111",
        position: "relative",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          padding: "40px 24px 36px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="39"
          viewBox="0 0 42 39"
          fill="none"
          style={{ display: "block", margin: "0 auto" }}
        >
          <path d="M14.4873 0.5H27.5107C27.5277 0.500078 27.538 0.506466 27.5439 0.512695C27.547 0.515905 27.5482 0.518771 27.5488 0.520508C27.5492 0.521506 27.5498 0.522873 27.5498 0.525391L26.709 10.3018V10.3027C26.6434 11.0898 27.4444 11.6215 28.1436 11.3359H28.1445L37.416 7.53516C37.4292 7.53007 37.4434 7.53157 37.4561 7.53711C37.4683 7.54258 37.4728 7.54958 37.4746 7.55469L41.499 19.6279V19.6299C41.4999 19.6327 41.5 19.6341 41.5 19.6348C41.4999 19.6356 41.4996 19.6379 41.498 19.6406C41.4965 19.6433 41.4939 19.6466 41.4902 19.6494L41.4717 19.6572L31.6807 21.8965L31.6797 21.8975C30.9345 22.0698 30.6045 22.9763 31.1318 23.5713V23.5723L37.7031 30.9971L37.7051 31C37.7076 31.0029 37.7088 31.0042 37.709 31.0049C37.7093 31.0059 37.7093 31.0083 37.709 31.0107C37.7087 31.0131 37.7082 31.0156 37.707 31.0176L37.6982 31.0264L27.1582 38.4912L27.1562 38.4922C27.1468 38.4988 27.135 38.5018 27.1211 38.499C27.1069 38.4962 27.0983 38.4888 27.0938 38.4814L21.8838 30.0947C21.4786 29.4428 20.5184 29.4428 20.1133 30.0947L14.9004 38.4824L14.8984 38.4844C14.8964 38.4877 14.8913 38.495 14.876 38.498C14.8602 38.5011 14.8461 38.4972 14.8359 38.4902L4.2998 31.0264C4.29558 31.0231 4.29376 31.0209 4.29297 31.0195C4.29188 31.0177 4.29126 31.0157 4.29102 31.0137C4.29079 31.0118 4.29064 31.0102 4.29102 31.0088C4.29133 31.0078 4.29288 31.0045 4.29688 31L10.8672 23.5742H10.8682C11.3945 22.9779 11.0673 22.0722 10.3203 21.8994H10.3193L0.52832 19.6602H0.529297C0.513926 19.6565 0.505651 19.649 0.501953 19.6426C0.500075 19.6393 0.500077 19.6364 0.5 19.6357C0.500003 19.6352 0.500301 19.6338 0.500977 19.6318V19.6309L4.52246 7.55469C4.52429 7.54958 4.52869 7.5426 4.54102 7.53711C4.55368 7.53153 4.56785 7.53011 4.58105 7.53516V7.53613L13.8525 11.3359H13.8535C14.5527 11.6215 15.3537 11.0898 15.2881 10.3027V10.3018L14.4473 0.525391C14.4473 0.523831 14.4479 0.522515 14.4482 0.521484C14.449 0.519566 14.4508 0.516155 14.4541 0.512695C14.4609 0.50569 14.4718 0.5 14.4873 0.5Z" fill="url(#sym_fill)" stroke="url(#sym_stroke)" strokeWidth="1"/>
          <defs>
            <linearGradient id="sym_fill" x1="0" y1="0" x2="45.6982" y2="4.96562" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B4FFAA"/>
              <stop offset="0.519231" stopColor="#1EFF00"/>
              <stop offset="1" stopColor="#B4FFAA"/>
            </linearGradient>
            <linearGradient id="sym_stroke" x1="21" y1="0" x2="21" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1EFF00"/>
              <stop offset="1" stopColor="#13A600"/>
            </linearGradient>
          </defs>
        </svg>
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

<Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
