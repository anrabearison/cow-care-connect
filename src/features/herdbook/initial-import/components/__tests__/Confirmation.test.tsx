import { render, screen, fireEvent } from '@testing-library/react';
import { Confirmation } from '../Confirmation';
import { describe, it, expect, vi } from 'vitest';

describe('Confirmation', () => {
  const mockHerdBookData = {
    reference: 'HB-2024',
    description: 'Test description',
    year: 2024,
  };

  it('should render confirmation details', () => {
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByText(/confirmation de l'import/i)).toBeInTheDocument();
    expect(screen.getByText('HB-2024')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show warning alert', () => {
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByText(/action irréversible/i)).toBeInTheDocument();
    expect(screen.getByText(/cette action ne peut être effectuée qu'une seule fois/i)).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={onConfirm} 
      />
    );

    const confirmButton = screen.getByText('Confirmer l\'import');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  it('should disable buttons when loading', () => {
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
        isLoading={true}
      />
    );

    // Quand isLoading est true, le bouton affiche "Import en cours..."
    // On cherche par texte exact car le rôle button ne fonctionne pas
    const confirmButton = screen.getByText('Import en cours...');
    expect(confirmButton).toBeDisabled();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByRole('region', { name: /confirmation de l'import/i })).toBeInTheDocument();
  });

  it('should not show description when not provided', () => {
    const dataWithoutDescription = {
      reference: 'HB-2024',
      year: 2024,
    };

    render(
      <Confirmation 
        herdBookData={dataWithoutDescription} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('should show cancel button', () => {
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  it('should show summary section', () => {
    render(
      <Confirmation 
        herdBookData={mockHerdBookData} 
        cattleCount={5} 
        onConfirm={vi.fn()} 
      />
    );

    expect(screen.getByText(/résumé de l'import/i)).toBeInTheDocument();
    expect(screen.getByText(/référence/i)).toBeInTheDocument();
    expect(screen.getByText(/année/i)).toBeInTheDocument();
    expect(screen.getByText(/bovins à importer/i)).toBeInTheDocument();
  });
});
