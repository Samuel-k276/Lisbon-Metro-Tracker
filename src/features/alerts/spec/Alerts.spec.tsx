import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Alerts } from "@/features/alerts/Alerts";
import type { LineState } from "@/shared/types/metro";

vi.mock("@/shared/api/fetchLineState", () => ({
  fetchLineStateAll: vi.fn(),
}));

import { fetchLineStateAll } from "@/shared/api/fetchLineState";
const mockFetch = vi.mocked(fetchLineStateAll);

const mockLineStates: LineState[] = [
  { name: "Azul", status: "Normal", message: "0" },
  { name: "Amarela", status: "Normal", message: "0" },
  { name: "Verde", status: "Conditioned", message: "Works between Cais do Sodré and Arroios" },
  { name: "Vermelha", status: "Normal", message: "0" },
];

describe("Alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<Alerts />);
    expect(document.querySelector("[class*='spinner']")).toBeInTheDocument();
  });

  it("renders all line cards after loading", async () => {
    mockFetch.mockResolvedValue(mockLineStates);
    render(<Alerts />);

    await waitFor(() => {
      expect(screen.getByText("Azul (Blue)")).toBeInTheDocument();
    });

    expect(screen.getByText("Amarela (Yellow)")).toBeInTheDocument();
    expect(screen.getByText("Verde (Green)")).toBeInTheDocument();
    expect(screen.getByText("Vermelha (Red)")).toBeInTheDocument();
  });

  it("shows status for each line", async () => {
    mockFetch.mockResolvedValue(mockLineStates);
    render(<Alerts />);

    await waitFor(() => {
      expect(screen.getAllByText(/Normal/).length).toBeGreaterThanOrEqual(3);
    });

    expect(screen.getByText(/Conditioned/)).toBeInTheDocument();
  });

  it("shows message when present", async () => {
    mockFetch.mockResolvedValue(mockLineStates);
    render(<Alerts />);

    await waitFor(() => {
      expect(screen.getByText("Works between Cais do Sodré and Arroios")).toBeInTheDocument();
    });
  });

  it("does not show message when value is 0", async () => {
    mockFetch.mockResolvedValue([{ name: "Azul", status: "Normal", message: "0" }]);
    render(<Alerts />);

    await waitFor(() => {
      expect(screen.getByText("Azul (Blue)")).toBeInTheDocument();
    });

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows error state on fetch failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    render(<Alerts />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch line states")).toBeInTheDocument();
    });
  });

  it("renders the page title", () => {
    mockFetch.mockResolvedValue([]);
    render(<Alerts />);
    expect(screen.getByText("Metro Line Status")).toBeInTheDocument();
  });
});
