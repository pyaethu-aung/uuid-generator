import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import useBrowserThemeSync from "./useBrowserThemeSync";

describe("useBrowserThemeSync", () => {
  let metaTag;

  beforeEach(() => {
    metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "theme-color");
    document.head.appendChild(metaTag);

    vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({
      getPropertyValue: (prop) => {
        if (prop === "--page-bg") return "#030712";
        return "";
      },
    }));
  });

  afterEach(() => {
    document.head.removeChild(metaTag);
    vi.restoreAllMocks();
  });

  it("sets theme-color to the static --page-bg value", () => {
    renderHook(() => useBrowserThemeSync("dark"));

    expect(metaTag.getAttribute("content")).toBe("#030712");
  });

  it("creates meta tag if none exists", () => {
    document.head.removeChild(metaTag);

    renderHook(() => useBrowserThemeSync("dark"));

    const created = document.querySelector('meta[name="theme-color"]');
    expect(created).not.toBeNull();
    expect(created.getAttribute("content")).toBe("#030712");

    // Clean up the created tag for afterEach
    metaTag = created;
  });

  it("updates theme-color when theme changes", () => {
    const { rerender } = renderHook(
      ({ theme }) => useBrowserThemeSync(theme),
      { initialProps: { theme: "dark" } }
    );

    expect(metaTag.getAttribute("content")).toBe("#030712");

    vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({
      getPropertyValue: (prop) => {
        if (prop === "--page-bg") return "#f8fafc";
        return "";
      },
    }));

    rerender({ theme: "light" });

    expect(metaTag.getAttribute("content")).toBe("#f8fafc");
  });
});
