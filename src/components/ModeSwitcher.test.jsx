import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ModeSwitcher from "./ModeSwitcher";

describe("ModeSwitcher", () => {
  it("renders the three UUID modes when a UUID leaf is active", () => {
    render(<ModeSwitcher activeLeaf="generator" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Generate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Validate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Convert" })).toBeInTheDocument();
  });

  it("marks the active mode with aria-current and leaves the rest unmarked", () => {
    render(<ModeSwitcher activeLeaf="validator" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Validate" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "Generate" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("advertises each mode's ⌥⇧ jump key via aria-keyshortcuts", () => {
    render(<ModeSwitcher activeLeaf="generator" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Generate" })).toHaveAttribute(
      "aria-keyshortcuts",
      "Alt+Shift+1"
    );
    expect(screen.getByRole("button", { name: "Convert" })).toHaveAttribute(
      "aria-keyshortcuts",
      "Alt+Shift+3"
    );
  });

  it("selects the target leaf when an inactive mode is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ModeSwitcher activeLeaf="generator" onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Convert" }));
    expect(onSelect).toHaveBeenCalledWith("converter");
  });

  it("does not re-select the already-active mode", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ModeSwitcher activeLeaf="generator" onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Generate" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders nothing for single-mode families", () => {
    const { container: ulid } = render(
      <ModeSwitcher activeLeaf="ulid" onSelect={() => {}} />
    );
    expect(ulid).toBeEmptyDOMElement();
    const { container: nano } = render(
      <ModeSwitcher activeLeaf="nanoid" onSelect={() => {}} />
    );
    expect(nano).toBeEmptyDOMElement();
  });
});
