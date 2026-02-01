import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import useBrowserThemeSync from "./useBrowserThemeSync";

describe("useBrowserThemeSync", () => {
  let metaTag;

  beforeEach(() => {
    // Setup meta tag in head
    metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "theme-color");
    document.head.appendChild(metaTag);

    // Mock getComputedStyle
    vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({
      getPropertyValue: (prop) => {
        if (prop === "--page-bg") return "#030712";
        if (prop === "--accent-primary") return "#2dd4bf";
        return "";
      },
    }));
  });

  afterEach(() => {
    document.head.removeChild(metaTag);
    vi.restoreAllMocks();
  });

  it("updates the meta theme-color tag with the value of --page-bg", () => {
    renderHook(() => useBrowserThemeSync("dark"));

    expect(metaTag.getAttribute("content")).toBe("#030712");
  });

  it("updates the meta theme-color tag with an interpolated value when opacity is provided", () => {
    // pageBg: #030712, accentColor: #2dd4bf
    // Interpolation at 0.5:
    // #030712 -> R:3, G:7, B:18
    // #2dd4bf -> R:45, G:212, B:191
    // Midpoint: R:24, G:110, B:105 -> #186e69
    renderHook(() => useBrowserThemeSync("dark", 0.5));

    expect(metaTag.getAttribute("content")).toBe("#186e69");
  });
});
