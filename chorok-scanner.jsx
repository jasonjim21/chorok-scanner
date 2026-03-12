import { useState, useRef, useCallback } from "react";

const STATES = {
  CAMERA: "camera",
  PROCESSING: "processing",
  RESULTS: "results",
};

function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        opacity: visible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        background: "#1a2f1a",
        color: "#d4e7c5",
        padding: "12px 24px",
        borderRadius: 100,
        fontSize: 14,
        fontFamily: "'Noto Serif KR', serif",
        letterSpacing: "0.02em",
        pointerEvents: "none",
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {message}
    </div>
  );
}

function SentenceCard({ sentence, index, selected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(index)}
      style={{
        position: "relative",
        padding: "16px 20px 16px 52px",
        background: selected
          ? "rgba(45, 80, 40, 0.18)"
          : "rgba(255,255,255,0.03)",
        borderLeft: selected
          ? "3px solid #6b9a5b"
          : "3px solid transparent",
        borderRadius: 4,
        transition: "all 0.2s ease",
        cursor: "pointer",
        animation: `fadeSlideIn 0.4s ease ${index * 0.06}s both`,
        userSelect: "none",
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          position: "absolute",
          left: 18,
          top: "50%",
          transform: "translateY(-50%)",
          width: 22,
          height: 22,
          borderRadius: 6,
          border: selected
            ? "2px solid #6b9a5b"
            : "2px solid rgba(255,255,255,0.15)",
          background: selected
            ? "rgba(107, 154, 91, 0.3)"
            : "transparent",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b9a5b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 15.5,
          lineHeight: 1.85,
          color: selected ? "#e8e4df" : "#c0bdb8",
          fontFamily: "'Noto Serif KR', serif",
          wordBreak: "keep-all",
          letterSpacing: "0.01em",
          transition: "color 0.2s ease",
        }}
      >
        {sentence}
      </p>
    </div>
  );
}

function BottomBar({ selectedCount, onCopy, onRecord }) {
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
        background: "linear-gradient(180deg, rgba(15, 26, 14, 0) 0%, rgba(15, 26, 14, 0.95) 20%, #0f1a0e 100%)",
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
          color: "#6b9a5b",
          fontFamily: "'Noto Sans KR', sans-serif",
          marginBottom: 12,
          letterSpacing: "0.03em",
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
            fontFamily: "'Noto Sans KR', sans-serif",
            cursor: "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.02em",
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
            background: "linear-gradient(135deg, #2d5028, #3a6b33)",
            border: "none",
            color: "#d4e7c5",
            padding: "14px 16px",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "'Noto Sans KR', sans-serif",
            cursor: "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.02em",
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

function ProcessingView() {
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
            border: "2px solid rgba(107, 154, 91, 0.15)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid transparent",
            borderTopColor: "#6b9a5b",
            borderRadius: "50%",
            animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            border: "2px solid transparent",
            borderTopColor: "#4a7a3f",
            borderRadius: "50%",
            animation:
              "spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse",
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#e8e4df",
            fontSize: 18,
            fontFamily: "'Noto Serif KR', serif",
            margin: "0 0 8px 0",
            letterSpacing: "0.05em",
          }}
        >
          문장을 읽고 있어요
        </p>
        <p
          style={{
            color: "#888",
            fontSize: 13,
            fontFamily: "'Noto Sans KR', sans-serif",
            margin: 0,
          }}
        >
          띄어쓰기 보정 및 문장 분리 중...
        </p>
      </div>
    </div>
  );
}

export default function ChorokScanner() {
  const [appState, setAppState] = useState(STATES.CAMERA);
  const [sentences, setSentences] = useState([]);
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2000);
  }, []);

  const selectedCount = selected.filter(Boolean).length;

  const getSelectedText = () => {
    return sentences.filter((_, i) => selected[i]).join("\n");
  };

  const handleCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Full = event.target.result;
      const base64Data = base64Full.split(",")[1];
      const mediaType = file.type || "image/jpeg";

      setCapturedImage(base64Full);
      setAppState(STATES.PROCESSING);
      setError(null);

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: mediaType,
                      data: base64Data,
                    },
                  },
                  {
                    type: "text",
                    text: `이 이미지에서 텍스트를 추출해주세요. 다음 규칙을 따라주세요:
1. 한국어 띄어쓰기를 올바르게 보정해주세요.
2. 문장 단위로 분리해주세요. (마침표, 물음표, 느낌표 기준)
3. 각 문장을 JSON 배열로 반환해주세요.
4. 페이지 번호, 머리글, 바닥글 등 본문이 아닌 요소는 제외해주세요.
5. 반드시 JSON 배열만 반환하고, 다른 텍스트는 포함하지 마세요.
6. 문장이 아닌 제목이나 챕터명도 포함해주세요.

예시 형식: ["첫 번째 문장입니다.", "두 번째 문장입니다."]`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();
        const text = data.content
          ?.map((item) => (item.type === "text" ? item.text : ""))
          .filter(Boolean)
          .join("");

        const cleanText = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanText);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setSentences(parsed);
          setSelected(new Array(parsed.length).fill(false));
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
    reader.readAsDataURL(file);
  };

  const handleToggle = (index) => {
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

  const copyToClipboard = (text) => {
    // Try modern API first, fallback to execCommand
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  };

  const handleCopy = async () => {
    const text = getSelectedText();
    const success = await copyToClipboard(text);
    showToast(success ? "클립보드에 복사되었어요" : "복사에 실패했어요");
  };

  const handleRecord = async () => {
    const text = getSelectedText();
    // TODO: 노션 API 연동
    const success = await copyToClipboard(text);
    showToast(success ? "초록에 기록되었어요 (노션 연동 예정)" : "복사에 실패했어요");
  };

  const handleReset = () => {
    setAppState(STATES.CAMERA);
    setSentences([]);
    setSelected([]);
    setCapturedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;700&family=Noto+Sans+KR:wght@300;400;500&display=swap');
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1a0e; }
      `}</style>

      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0f1a0e 0%, #141f13 50%, #111a10 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(107, 154, 91, 0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <header
          style={{ padding: "48px 28px 24px", position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 28,
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 300,
                  color: "#e8e4df",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                초록
              </h1>
              <p
                style={{
                  fontSize: 12,
                  color: "#6b9a5b",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  marginTop: 4,
                  letterSpacing: "0.15em",
                  fontWeight: 300,
                }}
              >
                문장 스캐너
              </p>
            </div>
            {appState === STATES.RESULTS && (
              <button
                onClick={handleReset}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#aaa",
                  padding: "8px 16px",
                  borderRadius: 100,
                  fontSize: 13,
                  fontFamily: "'Noto Sans KR', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                다시 촬영
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            padding: "0 28px 140px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Camera State */}
          {appState === STATES.CAMERA && (
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
                  {[
                    { top: 16, left: 16 },
                    { top: 16, right: 16 },
                    { bottom: 16, left: 16 },
                    { bottom: 16, right: 16 },
                  ].map((pos, i) => (
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
                        ...(i === 0
                          ? { borderTopWidth: 2, borderLeftWidth: 2 }
                          : i === 1
                          ? { borderTopWidth: 2, borderRightWidth: 2 }
                          : i === 2
                          ? { borderBottomWidth: 2, borderLeftWidth: 2 }
                          : { borderBottomWidth: 2, borderRightWidth: 2 }),
                      }}
                    />
                  ))}

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

                  {/* Shooting tips */}
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
                      페이지를 평평하게 펴고, 그림자가 지지 않게 촬영하면
                      인식률이 높아져요.
                    </p>
                  </div>
                </div>

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

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCapture}
                  style={{ display: "none" }}
                  id="camera-input"
                />

                <div style={{ display: "flex", gap: 12, width: "100%" }}>
                  <label
                    htmlFor="camera-input"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background:
                        "linear-gradient(135deg, #2d5028, #3a6b33)",
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

                  <label
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
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = handleCapture;
                      input.click();
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
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    갤러리
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {appState === STATES.PROCESSING && <ProcessingView />}

          {/* Results State */}
          {appState === STATES.RESULTS && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              {capturedImage && (
                <div
                  style={{
                    marginBottom: 20,
                    borderRadius: 8,
                    overflow: "hidden",
                    maxHeight: 100,
                    opacity: 0.5,
                  }}
                >
                  <img
                    src={capturedImage}
                    alt="captured"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    color: "#6b9a5b",
                    fontSize: 13,
                    fontFamily: "'Noto Sans KR', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {sentences.length}개의 문장을 찾았어요
                </p>
                <button
                  onClick={handleSelectAll}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#888",
                    fontSize: 13,
                    fontFamily: "'Noto Sans KR', sans-serif",
                    cursor: "pointer",
                    padding: "4px 8px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {selected.every(Boolean) ? "전체 해제" : "전체 선택"}
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {sentences.map((sentence, index) => (
                  <SentenceCard
                    key={index}
                    sentence={sentence}
                    index={index}
                    selected={selected[index]}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
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
    </>
  );
}
