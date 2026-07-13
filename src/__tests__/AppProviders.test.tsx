/**
 * Integration test for AppProviders
 * Ensures that AppProviders can be mounted within a Router context
 * without triggering "useNavigate() may be used only in the context of a <Router>" error
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/AppProviders';

// Mock UI components that cause issues in test environment
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => null,
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AppProviders Integration', () => {
  it('should mount without errors when wrapped in BrowserRouter', () => {
    // This test ensures that RefreshManagerSetup (which uses useNavigate)
    // can access the Router context when AppProviders is wrapped in BrowserRouter
    expect(() => {
      render(
        <BrowserRouter>
          <AppProviders>
            <div>Test Child</div>
          </AppProviders>
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it('should render children correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AppProviders>
          <div>Test Child</div>
        </AppProviders>
      </BrowserRouter>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should throw error when not wrapped in BrowserRouter', () => {
    // This test confirms the error exists when Router context is missing
    // This validates that our fix (wrapping in BrowserRouter) is necessary
    expect(() => {
      render(
        <AppProviders>
          <div>Test Child</div>
        </AppProviders>
      );
    }).toThrow(/useNavigate.*may be used only in the context of.*<Router>/);
  });
});
