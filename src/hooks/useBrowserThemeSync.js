import { useEffect } from "react";

export default function useBrowserThemeSync(theme) {
  useEffect(() => {
    const computedStyle = window.getComputedStyle(document.documentElement);
    const pageBg = computedStyle.getPropertyValue("--page-bg").trim();

    if (pageBg) {
      let metaTag = document.querySelector('meta[name="theme-color"]');
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "theme-color");
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", pageBg);
    }
  }, [theme]);
}
