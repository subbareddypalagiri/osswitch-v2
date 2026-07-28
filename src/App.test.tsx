import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import { invoke } from "@tauri-apps/api/core";

// Mock Tauri invoke
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("App Component", () => {
  it("renders correctly with logos and heading", () => {
    render(<App />);

    expect(screen.getByText("Welcome to Tauri + React")).toBeInTheDocument();
    expect(screen.getByAltText("Vite logo")).toBeInTheDocument();
    expect(screen.getByAltText("Tauri logo")).toBeInTheDocument();
    expect(screen.getByAltText("React logo")).toBeInTheDocument();
  });

  it("handles form submission and state hydration correctly", async () => {
    // Setup the mock response
    (invoke as any).mockResolvedValue("Hello Test User! You've been greeted from Rust!");

    render(<App />);

    const input = screen.getByPlaceholderText("Enter a name...");
    const button = screen.getByText("Greet");

    // Simulate typing into the input
    fireEvent.change(input, { target: { value: "Test User" } });
    
    // Ensure state updated and value is in input
    expect(input).toHaveValue("Test User");

    // Submit the form
    fireEvent.click(button);

    // Ensure invoke was called with correct arguments
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith("greet", { name: "Test User" });
    });

    // Ensure greeting message is displayed
    await waitFor(() => {
      expect(screen.getByText("Hello Test User! You've been greeted from Rust!")).toBeInTheDocument();
    });
  });
});
