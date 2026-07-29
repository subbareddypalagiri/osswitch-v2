import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StepInstall from "./StepInstall";
import { invoke } from "@tauri-apps/api/core";

// Mock Tauri modules
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));
vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
}));
vi.mock("@tauri-apps/plugin-dialog", () => ({
  open: vi.fn(),
}));

describe("StepInstall - Fallback UI State", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resets status to idle and clears the red error box when cancelling Fallback UI", async () => {
    // 1. Initial Failure to show red error box
    (invoke as any)
      .mockRejectedValueOnce(new Error("Generic Network Error"))
      // 2. Second failure triggers Fallback UI
      .mockRejectedValueOnce(new Error("ISO_DOWNLOAD_FAILED"));

    const setIsInstalling = vi.fn();
    
    render(
      <StepInstall
        onNext={vi.fn()}
        onBack={vi.fn()}
        selectedOS={["ubuntu"]}
        selectedIntents={{ ubuntu: "vbox_vm" }}
        selectedBundles={[]}
        backupEnabled={false}
        catalog={[{ id: "ubuntu", name: "Ubuntu", isoUrl: "http://ubuntu.com/iso" }]}
        isInstalling={false}
        setIsInstalling={setIsInstalling}
      />
    );

    // Initial state check - no error box
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();

    // Trigger installation (Fails with Generic Error)
    const installBtn = screen.getByRole("button", { name: /Install Ubuntu now/i });
    fireEvent.click(installBtn);

    // Wait for the red error box to appear
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to install OS ubuntu:/i)).toBeInTheDocument();
    });

    // Trigger installation again (Fails with ISO_DOWNLOAD_FAILED)
    const runBtn = screen.getByText("Run");
    fireEvent.click(runBtn);

    // Wait for the fallback UI to appear
    await waitFor(() => {
      expect(screen.getByText("Automatic Download Blocked")).toBeInTheDocument();
    });

    // Cancel fallback UI
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    // Verify Fallback UI is closed
    expect(screen.queryByText("Automatic Download Blocked")).not.toBeInTheDocument();

    // Verify the error box is cleared (status is reset to idle by runInstall)
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
  });
});
