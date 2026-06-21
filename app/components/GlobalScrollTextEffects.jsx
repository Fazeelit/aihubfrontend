"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const textSelector = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "a",
  "li",
  "label",
  "small",
  "strong",
  "em",
  "blockquote",
  "figcaption",
  "button",
  "td",
  "th",
].join(", ");

function hasMeaningfulText(element) {
  const text = element.textContent?.replace(/\s+/g, " ").trim();
  return Boolean(text);
}

export default function GlobalScrollTextEffects() {
  const pathname = usePathname();
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return undefined;
    }

    lastScrollYRef.current = window.scrollY;

    const applyTargets = () => {
      const elements = Array.from(document.querySelectorAll(textSelector));
      let textIndex = 0;
      const viewportHeight = window.innerHeight || 0;

      elements.forEach((element) => {
        if (!(element instanceof HTMLElement)) {
          return;
        }

        if (
          element.closest("[data-scroll-text-ignore]") ||
          !hasMeaningfulText(element)
        ) {
          return;
        }

        element.dataset.scrollText = "true";
        element.style.setProperty(
          "--scroll-text-delay",
          `${Math.min(textIndex % 6, 5) * 45}ms`,
        );

        const rect = element.getBoundingClientRect();
        const isInInitialViewport =
          rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;

        if (isInInitialViewport) {
          element.dataset.scrollState = "visible";
          element.classList.add("is-visible");
        } else if (!element.dataset.scrollState) {
          element.dataset.scrollState = "hidden";
          element.classList.remove("is-visible");
        }

        textIndex += 1;
      });
    };

    applyTargets();

    const setVisibleState = (element, isVisible) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      if (isVisible) {
        element.dataset.scrollState = "visible";
        element.classList.add("is-visible");
      } else {
        element.dataset.scrollState = "hidden";
        element.classList.remove("is-visible");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLElement)) {
            return;
          }

          const direction =
            window.scrollY >= lastScrollYRef.current ? "down" : "up";
          entry.target.dataset.scrollDirection = direction;
          setVisibleState(entry.target, entry.isIntersecting);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    const observeTargets = () => {
      document.querySelectorAll("[data-scroll-text='true']").forEach((element) => {
        observer.observe(element);
      });
    };

    observeTargets();

    const mutationObserver = new MutationObserver(() => {
      applyTargets();
      observeTargets();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const handleScroll = () => {
      lastScrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
