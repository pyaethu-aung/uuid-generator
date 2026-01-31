import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import useScrollOpacity from "./useScrollOpacity";

describe("useScrollOpacity", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollY", 0);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => cb());
  });

  it("returns 0 when scroll is at top", () => {
    const { result } = renderHook(() => useScrollOpacity());
    expect(result.current).toBe(0);
  });

  it("returns 0 when scroll is below threshold (e.g., 50px)", () => {
    vi.stubGlobal("scrollY", 50);
    const { result } = renderHook(() => useScrollOpacity());
    expect(result.current).toBe(0);
  });

  it("returns 1 when scroll is above max (e.g., 600px)", () => {
    vi.stubGlobal("scrollY", 600);
    const { result } = renderHook(() => useScrollOpacity());
    expect(result.current).toBe(1);
  });

  it("returns 0.5 when scroll is exactly in the middle (290px)", () => {
    vi.stubGlobal("scrollY", 290);
    const { result } = renderHook(() => useScrollOpacity());
    expect(result.current).toBe(0.5);
  });

  it("updates opacity on scroll", () => {
    const { result } = renderHook(() => useScrollOpacity());
    
    act(() => {
      vi.stubGlobal("scrollY", 290);
      window.dispatchEvent(new Event("scroll"));
    });
    
    expect(result.current).toBe(0.5);

    act(() => {
      vi.stubGlobal("scrollY", 500);
      window.dispatchEvent(new Event("scroll"));
    });
    
    expect(result.current).toBe(1);
  });
});
