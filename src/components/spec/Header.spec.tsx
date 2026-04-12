import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Header } from "@/components/Header";

const renderHeader = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>,
  );
};

describe("Header", () => {
  it("renders the logo text", () => {
    renderHeader();
    expect(screen.getByText("Metro Lisboa")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderHeader();
    expect(screen.getByText("Mapa em Tempo Real")).toBeInTheDocument();
    expect(screen.getByText("Planeia Viagem")).toBeInTheDocument();
    expect(screen.getByText("Sobre")).toBeInTheDocument();
    expect(screen.getByText("Tarifários")).toBeInTheDocument();
    expect(screen.getByText("Alertas")).toBeInTheDocument();
  });

  it("renders the logo icon with M", () => {
    renderHeader();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("has correct link destinations", () => {
    renderHeader();
    expect(screen.getByText("Mapa em Tempo Real").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Planeia Viagem").closest("a")).toHaveAttribute(
      "href",
      "/planear-viagem",
    );
    expect(screen.getByText("Sobre").closest("a")).toHaveAttribute("href", "/sobre");
    expect(screen.getByText("Tarifários").closest("a")).toHaveAttribute("href", "/tarifarios");
    expect(screen.getByText("Alertas").closest("a")).toHaveAttribute("href", "/alertas");
  });
});
