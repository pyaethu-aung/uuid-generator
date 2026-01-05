import { describe, expect, it, vi } from "vitest";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
  createRoot: createRootMock,
}));

vi.mock("./App.jsx", () => ({
  default: () => null,
}));

describe("main entry point", () => {
  it("creates the React root and renders", async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import("./main.jsx");

    const mountNode = document.getElementById("root");
    expect(createRootMock).toHaveBeenCalledWith(mountNode);
    expect(renderMock).toHaveBeenCalled();
  });
});
