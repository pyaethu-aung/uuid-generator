import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useUuidValidator from "./useUuidValidator";

const V4 = "550e8400-e29b-41d4-a716-446655440000";
const V7 = "01901b7c-d400-7000-8000-000000000001";
const V1 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const NIL = "00000000-0000-0000-0000-000000000000";

describe("useUuidValidator", () => {
  it("starts with empty input and null result", () => {
    const { result } = renderHook(() => useUuidValidator());
    expect(result.current.rawInput).toBe("");
    expect(result.current.result).toBeNull();
  });

  it("returns valid result for a v4 UUID", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput(V4));
    expect(result.current.result.valid).toBe(true);
    expect(result.current.result.version).toBe(4);
  });

  it("returns invalid result for garbage input", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput("not-a-uuid"));
    expect(result.current.result.valid).toBe(false);
  });

  it("validates a nil UUID", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput(NIL));
    expect(result.current.result.valid).toBe(true);
  });

  it("strips curly braces before validating", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput(`{${V4}}`));
    expect(result.current.result.valid).toBe(true);
  });

  it("resets result to null when input is cleared", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput(V4));
    expect(result.current.result).not.toBeNull();
    act(() => result.current.setRawInput(""));
    expect(result.current.result).toBeNull();
  });

  it("returns decoded data for a v7 UUID", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput(V7));
    expect(result.current.result.version).toBe(7);
    expect(result.current.result.decoded).not.toBeNull();
  });

  it("returns decoded data for a v1 UUID", () => {
    const { result } = renderHook(() => useUuidValidator());
    act(() => result.current.setRawInput(V1));
    expect(result.current.result.version).toBe(1);
    expect(result.current.result.decoded.node).toBe("00c04fd430c8");
  });
});
