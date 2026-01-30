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
});
