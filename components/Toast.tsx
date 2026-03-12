"use client";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
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
        pointerEvents: "none",
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}
