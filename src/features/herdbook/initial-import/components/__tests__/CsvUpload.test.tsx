import { render, screen, fireEvent } from '@testing-library/react';
import { CsvUpload } from '../CsvUpload';
import { describe, it, expect, vi } from 'vitest';

describe('CsvUpload', () => {
  it('should render upload zone', () => {
    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={null} />);

    expect(screen.getByRole('button', { name: /télécharger le template/i })).toBeInTheDocument();
    expect(screen.getByText(/glissez-déposez un fichier csv ici/i)).toBeInTheDocument();
  });

  it('should show selected file', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={file} />);

    expect(screen.getByText('test.csv')).toBeInTheDocument();
  });

  it('should call onRemove when remove button clicked', () => {
    const onRemove = vi.fn();
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    render(<CsvUpload onFileSelect={vi.fn()} onRemove={onRemove} selectedFile={file} />);

    const removeButton = screen.getByRole('button', { name: /supprimer le fichier sélectionné/i });
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={null} />);

    expect(screen.getByRole('region', { name: /fichier csv/i })).toBeInTheDocument();
  });

  it('should disable upload when loading', () => {
    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={null} isLoading={true} />);

    const uploadZone = screen.getByText(/glissez-déposez un fichier csv ici/i).closest('div');
    expect(uploadZone).toHaveClass('opacity-50');
  });

  it('should show format requirements', () => {
    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={null} />);

    expect(screen.getByText(/format requis/i)).toBeInTheDocument();
    expect(screen.getByText(/csv avec séparateur point-virgule/i)).toBeInTheDocument();
  });
});
