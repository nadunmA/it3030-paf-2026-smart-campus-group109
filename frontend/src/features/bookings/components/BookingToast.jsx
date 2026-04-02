import { useEffect } from "react";

export default function BookingToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast?.message) return;
    const timer = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast?.message) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 500,
        maxWidth: 380,
        padding: "12px 14px",
        borderRadius: 12,
        border: isSuccess
          ? "1px solid rgba(48,209,88,.45)"
          : "1px solid rgba(255,55,95,.45)",
        background: isSuccess
          ? "rgba(48,209,88,.16)"
          : "rgba(255,55,95,.16)",
        color: "#fff",
        boxShadow: "0 14px 36px rgba(0,0,0,.35)",
        fontSize: ".84rem",
      }}
    >
      {toast.message}
    </div>
  );
}
