import { useEffect } from "react";

export default function useBrowserThemeSync(theme) {
  useEffect(() => {
    const updateThemeColor = () => {
      const primaryColor = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-primary")
        .trim();

      if (primaryColor) {
        let metaTag = document.querySelector('meta[name="theme-color"]');
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("name", "theme-color");
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute("content", primaryColor);
      }
    };

    updateThemeColor();

    // Use a small delay to ensure CSS variables are applied
    const timeoutId = setTimeout(updateThemeColor, 0);
    return () => clearTimeout(timeoutId);
  }, [theme]);
}
