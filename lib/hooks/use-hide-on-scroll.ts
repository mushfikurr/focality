import { useEffect, useState } from "react";

type HideOnScrollProps = { scrollOffset?: number };

export function useHideOnScroll({
  scrollOffset: scrollOffsetProp,
}: HideOnScrollProps) {
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const scrollOffset = scrollOffsetProp ?? 0;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > scrollOffset) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, hidden, setHidden };
}
