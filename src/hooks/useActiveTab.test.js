import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import useActiveTab from "./useActiveTab";

beforeEach(() => {
  window.history.replaceState(null, "", "/uuid/generate");
});

describe("useActiveTab", () => {
  describe("canonical family/mode routes", () => {
    it("reads the generator leaf from /uuid/generate", () => {
      window.history.replaceState(null, "", "/uuid/generate");
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.activeTab).toBe("generator");
    });

    it("reads the validator leaf from /uuid/validate", () => {
      window.history.replaceState(null, "", "/uuid/validate");
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.activeTab).toBe("validator");
    });

    it("reads the converter leaf from /uuid/convert", () => {
      window.history.replaceState(null, "", "/uuid/convert");
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.activeTab).toBe("converter");
    });

    it("reads the ulid and nanoid leaves from their single-segment paths", () => {
      window.history.replaceState(null, "", "/ulid");
      expect(renderHook(() => useActiveTab()).result.current.activeTab).toBe("ulid");
      window.history.replaceState(null, "", "/nanoid");
      expect(renderHook(() => useActiveTab()).result.current.activeTab).toBe("nanoid");
    });
  });

  describe("canonicalisation on load", () => {
    it("redirects / to /uuid/generate and returns the generator leaf", () => {
      window.history.replaceState(null, "", "/");
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.activeTab).toBe("generator");
      expect(window.location.pathname).toBe("/uuid/generate");
    });

    it("rewrites a bare /uuid to /uuid/generate", () => {
      window.history.replaceState(null, "", "/uuid");
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.activeTab).toBe("generator");
      expect(window.location.pathname).toBe("/uuid/generate");
    });

    it.each([
      ["/generator", "generator", "/uuid/generate"],
      ["/validator", "validator", "/uuid/validate"],
      ["/bulk", "validator", "/uuid/validate"],
      ["/converter", "converter", "/uuid/convert"],
    ])("redirects legacy %s to its canonical home", (legacy, leaf, canonical) => {
      window.history.replaceState(null, "", legacy);
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.activeTab).toBe(leaf);
      expect(window.location.pathname).toBe(canonical);
    });

    it("does not rewrite a path that is already canonical", () => {
      window.history.replaceState(null, "", "/ulid");
      const replaceState = vi.spyOn(window.history, "replaceState");
      renderHook(() => useActiveTab());
      expect(replaceState).not.toHaveBeenCalled();
      replaceState.mockRestore();
    });
  });

  describe("setActiveTab", () => {
    it("updates state and pushes the canonical path", () => {
      const { result } = renderHook(() => useActiveTab());
      act(() => result.current.setActiveTab("validator"));
      expect(result.current.activeTab).toBe("validator");
      expect(window.location.pathname).toBe("/uuid/validate");
    });

    it("pushes /ulid for the single-mode ulid leaf", () => {
      const { result } = renderHook(() => useActiveTab());
      act(() => result.current.setActiveTab("ulid"));
      expect(window.location.pathname).toBe("/ulid");
    });

    it("does not push a duplicate history entry for the current leaf", () => {
      const pushState = vi.spyOn(window.history, "pushState");
      const { result } = renderHook(() => useActiveTab());
      act(() => result.current.setActiveTab("generator"));
      expect(pushState).not.toHaveBeenCalled();
      pushState.mockRestore();
    });
  });

  describe("lastLeafByFamily memory", () => {
    it("seeds the initial family from the loaded path", () => {
      window.history.replaceState(null, "", "/uuid/convert");
      const { result } = renderHook(() => useActiveTab());
      expect(result.current.lastLeafByFamily).toEqual({ uuid: "converter" });
    });

    it("remembers the UUID mode visited before leaving the family", () => {
      const { result } = renderHook(() => useActiveTab());
      act(() => result.current.setActiveTab("validator"));
      act(() => result.current.setActiveTab("nanoid"));
      // UUID's remembered mode survives the trip to NanoID.
      expect(result.current.lastLeafByFamily.uuid).toBe("validator");
      expect(result.current.lastLeafByFamily.nanoid).toBe("nanoid");
    });
  });
});
