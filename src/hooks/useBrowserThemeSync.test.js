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
        if (prop === "--accent-primary") return "#2dd4bf";
        return "";
      },
    }));
  });

  afterEach(() => {
    document.head.removeChild(metaTag);
    vi.restoreAllMocks();
  });

  it("updates the meta theme-color tag with the value of --accent-primary", () => {
    renderHook(() => useBrowserThemeSync("dark"));

    expect(metaTag.getAttribute("content")).toBe("#2dd4bf");
  });
});
