import { useState, useEffect } from "react";

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      let current = ids[0];

      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.offsetTop - 120; // navbar offset
        const bottom = top + el.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          current = id;
        }
      });

      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids]);

  return active;
}