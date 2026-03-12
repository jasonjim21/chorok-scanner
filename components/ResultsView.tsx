"use client";

import SentenceCard from "./SentenceCard";

interface ResultsViewProps {
  sentences: string[];
  selected: boolean[];
  capturedImage: string | null;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
}

export default function ResultsView({
  sentences,
  selected,
  capturedImage,
  onToggle,
  onSelectAll,
}: ResultsViewProps) {
  const allSelected = selected.length > 0 && selected.every(Boolean);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* 촬영 이미지 썸네일 */}
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
            alt="촬영한 페이지"
            style={{
              width: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
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
        <p
          style={{
            color: "#00e600",
            fontSize: 13,
            fontFamily: "'Noto Sans KR', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {sentences.length}개의 문장을 찾았어요
        </p>
        <button
          onClick={onSelectAll}
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
          {allSelected ? "전체 해제" : "전체 선택"}
        </button>
      </div>

      {/* 문장 카드 리스트 */}
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
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
