import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
  it("renders the copyright text with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders the disclaimer", () => {
    render(<Footer />);
    expect(
      screen.getByText(/não está afiliada oficialmente ao Metro de Lisboa/),
    ).toBeInTheDocument();
  });
});
