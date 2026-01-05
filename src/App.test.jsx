import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockToggleTheme,
  mockRegenerate,
  mockDownloadList,
  mockHandleCopy,
  mockHandleVersionChange,
  mockToggleOption,
  mockSetBatchSize,
  mockCommitBatchSize,
  useThemeMock,
  useUuidGeneratorMock,
} = vi.hoisted(() => ({
  mockToggleTheme: vi.fn(),
  mockRegenerate: vi.fn(),
  mockDownloadList: vi.fn(),
  mockHandleCopy: vi.fn(),
  mockHandleVersionChange: vi.fn(),
  mockToggleOption: vi.fn(),
  mockSetBatchSize: vi.fn(),
  mockCommitBatchSize: vi.fn(),
  useThemeMock: vi.fn(),
  useUuidGeneratorMock: vi.fn(),
}));

vi.mock("./hooks/useTheme", () => ({
  default: useThemeMock,
}));

vi.mock("./hooks/useUuidGenerator", () => ({
  default: useUuidGeneratorMock,
}));

const createGeneratorState = (overrides = {}) => ({
  batchSize: 5,
  setBatchSize: mockSetBatchSize,
  visibleBatchSize: 5,
  selectedVersion: "v4",
  options: { uppercase: false, trimHyphens: false, wrapBraces: false },
  formattedUuids: ["abc-123"],
  copiedUuid: "",
  feedback: "Copied!",
  clipboardSupported: true,
  isRefreshing: false,
  isDownloading: false,
  regenerate: mockRegenerate,
  handleCopy: mockHandleCopy,
  handleVersionChange: mockHandleVersionChange,
  toggleOption: mockToggleOption,
  downloadList: mockDownloadList,
  commitBatchSize: mockCommitBatchSize,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useThemeMock.mockReturnValue({ theme: "dark", toggleTheme: mockToggleTheme });
  useUuidGeneratorMock.mockReturnValue(createGeneratorState());
});

import App from "./App";

describe("App", () => {
  it("renders core controls and wires primary actions", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/Instant UUID generator/i)).toBeInTheDocument();
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /switch to light mode/i })
    );
    expect(mockToggleTheme).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /refresh/i }));
    expect(mockRegenerate).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /download/i }));
    expect(mockDownloadList).toHaveBeenCalled();
  });

  it("displays busy states while refreshing or downloading", () => {
    useUuidGeneratorMock.mockReturnValue(
      createGeneratorState({ isRefreshing: true, isDownloading: true })
    );

    render(<App />);

    expect(screen.getByRole("button", { name: /refresh/i })).toHaveAttribute(
      "aria-busy",
      "true"
    );
    expect(screen.getByRole("button", { name: /Preparing/i })).toHaveAttribute(
      "aria-busy",
      "true"
    );
    expect(screen.getByText(/Preparing.../i)).toBeInTheDocument();
  });
});
