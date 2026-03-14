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
          }}
        >
          <div
            style={{
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
          </div>
          {/* 재촬영 버튼: 흰색 라인 12px 위 */}
          <button
            onClick={onRetake}
            style={{
              position: "absolute",
              bottom: -16,
              left: "50%",
              transform: "translateX(-50%)",
              width: 63,
              height: 32,
              borderRadius: 34,
              background: "#F1F1F1",
              border: "1px solid #EEE",
              boxShadow: "0 0 4px 0 rgba(0,0,0,0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.28836 11.9083C8.13757 12.6035 9.16667 13.0003 10.2646 13.0003C12.9286 13.0003 15.0979 10.7561 15.0979 8C15.0979 5.24393 12.9286 3.00239 10.2646 3.00239C7.60053 3.00239 5.52116 5.17003 5.44709 7.86042H7.96825L3.98413 12.9812L0 7.85768H2.53968C2.61376 3.51146 6.05027 0 10.2672 0C14.4841 0 18 3.58809 18 8C18 12.4119 14.5317 16 10.2672 16C8.52646 16 6.87566 15.4034 5.52645 14.3141L7.29101 11.9083H7.28836Z" fill="#FF393C"/>
            </svg>
          </button>
        </div>
      )}

      {/* 문장 목록 영역 — 그라디언트 배경 + 상단 라인 */}
      <div
        style={{
          marginLeft: -20,
          marginRight: -20,
          background: "linear-gradient(180deg, #050505 0%, #131313 100%)",
          borderTop: `1px solid ${selectedCount > 0 ? "#1EFF00" : "#EEEEEE"}`,
          transition: "border-top-color 0.2s ease",
          minHeight: 644,
          padding: "0 20px",
        }}
      >
        {/* 정보 바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
          }}
        >
          <p style={{ color: selectedCount > 0 ? "#1EFF00" : "#909090", fontSize: 14, fontWeight: 400, lineHeight: "150%", letterSpacing: "-0.28px", margin: 0 }}>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
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
      </div>{/* /그라디언트 배경 컨테이너 */}

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
