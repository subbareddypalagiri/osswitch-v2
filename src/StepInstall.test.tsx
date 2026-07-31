import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import StepInstall from './StepInstall';

describe('StepInstall Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(screen.getByText(/Terminal - Ubuntu Linux/i)).toBeInTheDocument();
    
    // Check if the Install button is present
    expect(screen.getByRole('button', { name: /Install Ubuntu Linux now/i })).toBeInTheDocument();
  });

  it('handles the installation flow and updates progress', async () => {
    const setIsInstalling = vi.fn();

    render(
      <StepInstall 
        onNext={() => {}} 
        onBack={() => {}} 
        selectedOS={['arch']} 
        selectedIntents={{ arch: 'usb_flash' }} 
        selectedBundles={[]} 
        backupEnabled={false} 
        catalog={[{ id: 'arch', name: 'Arch Linux' }]} 
        isInstalling={false} 
        setIsInstalling={vi.fn()} 
        osSpace={50}
      />
    );
    
    const installButton = screen.getByRole('button', { name: /Install Arch Linux now/i });
    fireEvent.click(installButton);
    
    // Expect the state setter to be called indicating installation started
    expect(setIsInstalling).toHaveBeenCalledWith(true);
  });
});
