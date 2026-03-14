"use client";

import SentenceCard from "./SentenceCard";

interface ResultsViewProps {
  sentences: string[];
  selected: boolean[];
  capturedImage: string | null;
  merged: boolean;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onMerge: () => void;
  onRetake: () => void;
}

export default function ResultsView({
  sentences,
  selected,
  capturedImage,
  merged,
  onToggle,
  onSelectAll,
  onMerge,
  onRetake,
}: ResultsViewProps) {
  const selectedCount = selected.filter(Boolean).length;
  const allSelected = selected.length > 0 && selected.every(Boolean);
  const showMergeToggle = selectedCount >= 2;
  const mergedText = sentences.filter((_, i) => selected[i]).join(" ");

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* 촬영 이미지 썸네일 + 재촬영 버튼 */}
      {capturedImage && (
        <div
          style={{
            position: "relative",
            marginBottom: 20,
            borderRadius: 8,
            overflow: "hidden",
            maxHeight: 100,
          }}
        >
          <img
            src={capturedImage}
            alt="촬영한 페이지"
            style={{
              width: "100%",
              objectFit: "cover",
              objectPosition: "top",
              opacity: 0.5,
              display: "block",
            }}
          />
          <button
            onClick={onRetake}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#e63946",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      )}

      {/* 정보 바 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p style={{ color: "#00e600", fontSize: 13 }}>
          {selectedCount > 0
            ? `${selectedCount}개의 문장을 선택했어요`
            : `${sentences.length}개의 문장을 찾았어요`}
        </p>
        <button
          onClick={onSelectAll}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: 13,
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          {allSelected ? "전체 해제" : "전체 선택"}
        </button>
      </div>

      {/* 문장 카드 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {merged ? (
          <SentenceCard
            sentence={mergedText}
            index={0}
            selected={true}
            onToggle={() => {}}
          />
        ) : (
          sentences.map((sentence, index) => (
            <SentenceCard
              key={index}
              sentence={sentence}
              index={index}
              selected={selected[index]}
              onToggle={onToggle}
            />
          ))
        )}
      </div>

      {/* 문장 하나로 엮기 토글 (2개 이상 선택 시) */}
      {showMergeToggle && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 99,
          }}
        >
          <button
            onClick={onMerge}
            aria-label="문장 하나로 엮기"
            style={{
              position: "relative",
              width: 44,
              height: 26,
              borderRadius: 13,
              background: merged ? "#00e600" : "#333",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s ease",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: merged ? 21 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s ease",
              }}
            />
          </button>
          <p style={{ color: "#888", fontSize: 13, whiteSpace: "nowrap" }}>문장 하나로 엮기</p>
        </div>
      )}
    </div>
  );
}
