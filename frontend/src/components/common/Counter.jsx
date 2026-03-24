import { useState, useEffect } from "react";
import { useInView } from "../../hooks/useInView";

export default function Counter({ target, suffix = "", delay = 0 }) {
  const [ref, visible] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setN(target);
        clearInterval(t);
      } else setN(cur);
    }, 16);
    return () => clearInterval(t);
  }, [visible, target]);
  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem,4vw,3rem)",
          fontWeight: 700,
          letterSpacing: "-.035em",
        }}
      >
        {n}
        {suffix}
      </div>
    </div>
  );
}
