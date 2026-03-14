"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "글자를 혼내는 중...",
  "오와 열을 맞추는 중...",
  "문장을 꼬집는 중...",
  "글자 출석 부르는 중...",
  "마침표 설득하는 중...",
  "쉼표랑 협상 중...",
  "문장 길들이는 중...",
  "글자 체포하는 중...",
  "띄어쓰기 심문 중...",
  "문장에게 사과 받는 중...",
  "활자 면접 보는 중...",
  "문장 소환 중…",
  "글자 탈출 막는 중…",
  "문장 줄 세우는 중…",
  "받침 수거하는 중…",
  "글자 세탁하는 중...",
  "문장 다림질 중...",
  "모음 수확하는 중...",
  "자음 소집하는 중...",
  "문장 신원 확인 중...",
  "마침표 추적 중...",
  "글자 점호 중...",
  "문장 재활 훈련 중...",
  "띄어쓰기 벌금 매기는 중...",
  "글자 DNA 검사 중...",
  "문장 입양 절차 중...",
  "활자 감정 평가 중...",
  "받침 귀가 조치 중...",
  "글자 몸무게 재는 중...",
  "문장 성격 파악 중...",
  "쌍자음 분리 수거 중...",
  "글자 보석 감정 중…",
  "문장 면담 중…",
  "활자 신체검사 중…",
  "글자 이민 심사 중…",
  "문장 사회화 교육 중...",
  "글자 혈액형 검사 중...",
  "마침표 인수인계 중...",
  "문장 반성문 받는 중...",
  "글자 지문 채취 중...",
  "받침 안부 묻는 중...",
  "문장 신용 조회 중...",
  "글자 예방 접종 중...",
  "띄어쓰기 현장 검증 중...",
  "문장 졸업 심사 중...",
  "글자 수면 마취 중...",
  "모음 회유하는 중...",
  "문장 비자 발급 중...",
  "글자 적성 검사 중...",
  "활자 몸값 협상 중...",
  "문장 보호 관찰 중...",
  "글자 위치 추적 중...",
  "받침 상담하는 중...",
  "문장 출국 심사 중...",
  "글자 양육권 다투는 중...",
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ProcessingView() {
  const [queue] = useState<string[]>(() => shuffleArray(MESSAGES));
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % queue.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            border: "2px solid rgba(0, 230, 0, 0.15)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid transparent",
            borderTopColor: "#00e600",
            borderRadius: "50%",
            animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            border: "2px solid transparent",
            borderTopColor: "#00a000",
            borderRadius: "50%",
            animation: "spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse",
          }}
        />
      </div>

      <p
        style={{
          color: "#e8e4df",
          fontSize: 16,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {queue[index]}
      </p>
    </div>
  );
}
