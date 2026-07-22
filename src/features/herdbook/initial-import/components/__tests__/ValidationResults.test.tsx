import { render, screen, fireEvent } from '@testing-library/react';
import { ValidationResults } from '../ValidationResults';
import { describe, it, expect, vi } from 'vitest';

describe('ValidationResults', () => {
  const mockValidResult = {
    valid: true,
    totalRows: 2,
    validRowsCount: 2,
    errors: [],
  };

  const mockInvalidResult = {
    valid: false,
    totalRows: 2,
    validRowsCount: 1,
    errors: [
      { rowNumber: 2, field: 'name', message: 'Required' },
      { rowNumber: 3, field: 'gender', message: 'Invalid value' },
    ],
  };

  it('should show success state when valid', () => {
    render(
      <ValidationResults 
        result={mockValidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByText(/validation réussie/i)).toBeInTheDocument();
    expect(screen.getByText(/2 ligne\(s\) valide\(s\) sur 2/i)).toBeInTheDocument();
  });

  it('should show error state when invalid', () => {
    render(
      <ValidationResults 
        result={mockInvalidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByText(/erreurs détectées/i)).toBeInTheDocument();
    expect(screen.getByText(/2 erreur\(s\) trouvée\(s\) sur 2 lignes/i)).toBeInTheDocument();
  });

  it('should display error table when errors exist', () => {
    render(
      <ValidationResults 
        result={mockInvalidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByText('Ligne')).toBeInTheDocument();
    expect(screen.getByText('Champ')).toBeInTheDocument();
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should show confirm button when valid', () => {
    const onConfirm = vi.fn();
    render(
      <ValidationResults 
        result={mockValidResult} 
        onBack={vi.fn()} 
        onConfirm={onConfirm} 
      />
    );

    expect(screen.getByRole('button', { name: /confirmer l'import/i })).toBeInTheDocument();
  });

  it('should not show confirm button when invalid', () => {
    render(
      <ValidationResults 
        result={mockInvalidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.queryByRole('button', { name: /confirmer l'import/i })).not.toBeInTheDocument();
  });

  it('should call onBack when back button clicked', () => {
    const onBack = vi.fn();
    render(
      <ValidationResults 
        result={mockValidResult} 
        onBack={onBack} 
        onConfirm={vi.fn()} 
      />
    );

    const backButton = screen.getByRole('button', { name: /retour/i });
    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalled();
  });

  it('should call onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ValidationResults 
        result={mockValidResult} 
        onBack={vi.fn()} 
        onConfirm={onConfirm} 
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer l'import/i });
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <ValidationResults 
        result={mockValidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByRole('region', { name: /validation réussie/i })).toBeInTheDocument();
  });

  it('should have error table ARIA attributes when errors exist', () => {
    render(
      <ValidationResults 
        result={mockInvalidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByRole('region', { name: /erreurs détectées/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /tableau des erreurs/i })).toBeInTheDocument();
  });

  it('should disable buttons when loading', () => {
    render(
      <ValidationResults 
        result={mockValidResult} 
        onBack={vi.fn()} 
        onConfirm={vi.fn()} 
        isLoading={true}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer l'import/i });
    expect(confirmButton).toBeDisabled();
  });
});
