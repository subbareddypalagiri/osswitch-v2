import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StepBundles from './StepBundles';

describe('StepBundles Component', () => {
  it('renders all bundle categories correctly', () => {
    render(
      <StepBundles 
        onNext={() => {}} 
        onBack={() => {}} 
        selectedBundles={[]} 
        setSelectedBundles={() => {}} 
      />
    );
    
    // Check if main categories are rendered
    expect(screen.getByText('End-to-End Developer')).toBeInTheDocument();
    expect(screen.getByText('Ultimate Gaming')).toBeInTheDocument();
    expect(screen.getByText('Cyber Security & Privacy')).toBeInTheDocument();
    
    // Check if some specific tools are rendered
    expect(screen.getByText('VS Code')).toBeInTheDocument();
    expect(screen.getByText('Docker Desktop')).toBeInTheDocument();
    expect(screen.getByText('OBS Studio')).toBeInTheDocument();
  });

  it('allows selecting and deselecting a software package', () => {
    const setSelectedBundles = vi.fn();
    
    render(
      <StepBundles 
        onNext={() => {}} 
        onBack={() => {}} 
        selectedBundles={['Microsoft.VisualStudioCode']} 
        setSelectedBundles={setSelectedBundles} 
      />
    );
    
    // The VS Code button should be selected (we check the UI state or click it to deselect)
    const vsCodeButton = screen.getByText('VS Code').closest('button');
    expect(vsCodeButton).not.toBeNull();
    
    // Click to deselect
    fireEvent.click(vsCodeButton!);
    
    // It should call setSelectedBundles with an empty array (removing VS Code)
    expect(setSelectedBundles).toHaveBeenCalledWith([]);
  });
});
