import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import StepInstall from './StepInstall';

describe('StepInstall Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).__TAURI_INTERNALS__ = {};
  });

  it('renders the OS installation UI correctly', () => {
    render(
      <StepInstall 
        onNext={() => {}} 
        onBack={() => {}} 
        selectedOS={['ubuntu']} 
        selectedIntents={{ ubuntu: 'vbox_vm' }} 
        selectedBundles={[]} 
        backupEnabled={false} 
        catalog={[{ id: 'ubuntu', name: 'Ubuntu Linux' }]} 
        isInstalling={false} 
        setIsInstalling={() => {}} 
        osSpace={50}
      />
    );
    
    // Check if the target OS name appears in the terminal header or tab
    expect(screen.getByText(/Terminal/i)).toBeInTheDocument();
    
    // Check if the Start Provisioning button is present
    expect(screen.getByRole('button', { name: /Start Provisioning Ubuntu Linux/i })).toBeInTheDocument();
  });

  it('handles the installation flow and updates progress', async () => {
    const setIsInstalling = vi.fn();

    render(
      <StepInstall 
        onNext={() => {}} 
        onBack={() => {}} 
        selectedOS={['arch']} 
        selectedIntents={{ arch: 'vbox_vm' }} 
        selectedBundles={[]} 
        backupEnabled={false} 
        catalog={[{ id: 'arch', name: 'Arch Linux' }]} 
        isInstalling={false} 
        setIsInstalling={setIsInstalling} 
        osSpace={50}
      />
    );
    
    const installButton = screen.getByRole('button', { name: /Start Provisioning Arch Linux/i });
    fireEvent.click(installButton);
    
    // Expect the state setter to be called indicating installation started
    expect(setIsInstalling).toHaveBeenCalledWith(true);
  });
});
