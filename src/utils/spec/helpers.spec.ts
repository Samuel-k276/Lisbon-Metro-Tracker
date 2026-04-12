import { describe, it, expect } from "vitest";
import {
  formatTime,
  formatTimeInSeconds,
  calculateDistance,
  findNearestStation,
  getLineNameFromDestination,
} from "@/utils/helpers";
import type { Station } from "@/types/metro";

describe("formatTimeInSeconds", () => {
  it("returns 'Chegando' for 0 seconds", () => {
    expect(formatTimeInSeconds(0)).toBe("Chegando");
  });

  it("returns 'Chegando' for negative values", () => {
    expect(formatTimeInSeconds(-5)).toBe("Chegando");
  });

  it("formats seconds only when under a minute", () => {
    expect(formatTimeInSeconds(45)).toBe("45s");
  });

  it("formats minutes and seconds", () => {
    expect(formatTimeInSeconds(125)).toBe("2m 5s");
  });

  it("handles string input", () => {
    expect(formatTimeInSeconds("90")).toBe("1m 30s");
  });

  it("returns 'Chegando' for non-numeric strings", () => {
    expect(formatTimeInSeconds("abc")).toBe("Chegando");
  });
});

describe("calculateDistance", () => {
  it("returns 0 for same point", () => {
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
  });

  it("calculates distance between two points", () => {
    expect(calculateDistance(0, 0, 3, 4)).toBe(5);
  });
});

describe("findNearestStation", () => {
  const makeStation = (id: string, x: number, y: number): Station =>
    ({
      id,
      name: id,
      coordinates: { x, y },
      lines: [],
      isTransfer: false,
      isTerminal: false,
      nextTrains: [],
    }) as Station;

  it("returns null for empty array", () => {
    expect(findNearestStation({ x: 0, y: 0 }, [])).toBeNull();
  });

  it("returns the nearest station", () => {
    const stations = [makeStation("A", 10, 10), makeStation("B", 1, 1), makeStation("C", 20, 20)];
    const result = findNearestStation({ x: 0, y: 0 }, stations);
    expect(result?.id).toBe("B");
  });
});

describe("getLineNameFromDestination", () => {
  it("returns 'Unknown' for empty string", () => {
    expect(getLineNameFromDestination("")).toBe("Unknown");
  });

  it("returns a line name for a valid station ID", () => {
    // "AM" (Alameda) is on Verde and Vermelha
    const result = getLineNameFromDestination("AM");
    expect(["Verde", "Vermelha"]).toContain(result);
  });
});
