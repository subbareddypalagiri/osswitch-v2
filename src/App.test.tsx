import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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

describe("App Component", () => {
  it("renders the OSwitch welcome screen", () => {
    render(<App />);
    expect(screen.getByText("OSwitch")).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the future of/i)).toBeInTheDocument();
  });

  it("renders sidebar with all 6 steps", () => {
    render(<App />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("System Scan")).toBeInTheDocument();
    expect(screen.getByText("Choose OS")).toBeInTheDocument();
    expect(screen.getByText("Software Bundles")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.getByText("Run Console")).toBeInTheDocument();
  });

  it("has a Get Started button", () => {
    render(<App />);
    const btn = screen.getByText(/Get Started/i);
    expect(btn).toBeInTheDocument();
  });
});

