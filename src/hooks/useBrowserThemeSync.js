import { useEffect } from "react";
import { interpolateColor } from "../utils/colors";

export default function useBrowserThemeSync(theme, opacity = 0) {
  useEffect(() => {
    const updateThemeColor = () => {
      const computedStyle = window.getComputedStyle(document.documentElement);
      const pageBg = computedStyle.getPropertyValue("--page-bg").trim();
      const accentColor = computedStyle.getPropertyValue("--accent-primary").trim();

      if (pageBg && accentColor) {
        // Only interpolate if we have both colors and they are valid hex
        // Colors from getComputedStyle are usually rgb() but our util likes hex.
        // Wait, getComputedStyle returns rgb(r, g, b).
        // Let's handle both or ensure we get clean values.
        
        const toHex = (rgbStr) => {
          if (rgbStr.startsWith("#")) return rgbStr;
          const match = rgbStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          if (!match) return "#000000";
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };

        const startColor = toHex(pageBg);
        const endColor = toHex(accentColor);
        const currentColor = interpolateColor(startColor, endColor, opacity);

        let metaTag = document.querySelector('meta[name="theme-color"]');
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("name", "theme-color");
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute("content", currentColor);

        // Also set html background to match for seamless overscroll
        document.documentElement.style.backgroundColor = currentColor;
      }
    };

    updateThemeColor();
  }, [theme, opacity]);
}
