import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Tauri invoke to prevent actual Rust backend calls during UI tests
vi.mock('@tauri-apps/api/core', () => {
  return {
    invoke: vi.fn((cmd: string) => {
      if (cmd === 'get_gemini_models') return Promise.resolve(['gemini-1.5-pro', 'gemini-1.5-flash']);
      if (cmd === 'get_drives') return Promise.resolve("C: [100.0GB / 500.0GB Free]\nD: [200.0GB / 1000.0GB Free]");
      if (cmd === 'run_safety_check') return Promise.resolve({ is_admin: true, secure_boot_enabled: false, virtualization_enabled: true, c_drive_protected: true });
      return Promise.resolve("Mock Success");
    })
  };
});
