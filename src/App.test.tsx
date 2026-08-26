import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue({
    cpu: "Test CPU", ram_gb: 16, disk_free_gb: 100, disk_total_gb: 500,
    os: "Windows 11", virtualization: true, is_admin: true,
    secure_boot_enabled: false, c_drive_protected: true
  }),
}));
vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(() => Promise.resolve(() => {})) }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));
vi.mock("@tauri-apps/plugin-opener", () => ({ openUrl: vi.fn() }));

(globalThis as any).fetch = vi.fn().mockRejectedValue(new Error("No network in test"));

import { act, fireEvent } from "@testing-library/react";

describe("App Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the OSwitch welcome screen (Tour)", () => {
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(3000); // Fast-forward past the LoadingSplash
    });
    
    expect(screen.getByText(/Welcome to OSwitch/i)).toBeInTheDocument();
  });

  it("renders sidebar with Welcome step after skipping tour", () => {
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    const skipBtn = screen.getByText(/Skip/i);
    fireEvent.click(skipBtn);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("has a Get Started button on the first step", () => {
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    const skipBtn = screen.getByText(/Skip/i);
    fireEvent.click(skipBtn);

    const btn = screen.getByText(/Get Started/i);
    expect(btn).toBeInTheDocument();
  });
});

