import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CsvUpload } from '../CsvUpload';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock('@/features/herdbook/services', () => ({
  herdBookService: {
    downloadCsvTemplate: vi.fn(),
  },
}));

import { herdBookService } from '@/features/herdbook/services';

describe('CsvUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

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

  it('should show a toast when a dropped file is too large', async () => {
    const onFileSelect = vi.fn();
    render(<CsvUpload onFileSelect={onFileSelect} onRemove={vi.fn()} selectedFile={null} />);

    const dropzone = screen.getByText(/glissez-déposez un fichier csv ici/i).closest('div')!;
    const bigFile = new File([new Uint8Array(6 * 1024 * 1024)], 'big.csv', { type: 'text/csv' });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [bigFile], items: [{ kind: 'file', type: 'text/csv', getAsFile: () => bigFile }], types: ['Files'] },
    });

    await waitFor(() => {
      expect(onFileSelect).not.toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'destructive', description: expect.stringMatching(/5 Mo/) })
      );
    });
  });

  it('should show a toast when a dropped file has the wrong format', async () => {
    const onFileSelect = vi.fn();
    render(<CsvUpload onFileSelect={onFileSelect} onRemove={vi.fn()} selectedFile={null} />);

    const dropzone = screen.getByText(/glissez-déposez un fichier csv ici/i).closest('div')!;
    const wrongFile = new File(['content'], 'notes.txt', { type: 'text/plain' });

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [wrongFile], items: [{ kind: 'file', type: 'text/plain', getAsFile: () => wrongFile }], types: ['Files'] },
    });

    await waitFor(() => {
      expect(onFileSelect).not.toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'destructive', description: expect.stringMatching(/format csv/i) })
      );
    });
  });

  it('should disable the template button and show a spinner while downloading', async () => {
    let resolveDownload: (blob: Blob) => void;
    (herdBookService.downloadCsvTemplate as any).mockReturnValue(
      new Promise((resolve) => {
        resolveDownload = resolve;
      })
    );

    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={null} />);

    const templateButton = screen.getByRole('button', { name: /télécharger le template/i });
    fireEvent.click(templateButton);

    await waitFor(() => expect(templateButton).toBeDisabled());

    resolveDownload!(new Blob(['a,b,c'], { type: 'text/csv' }));

    await waitFor(() => expect(templateButton).not.toBeDisabled());
  });

  it('should show a toast when the template download fails', async () => {
    (herdBookService.downloadCsvTemplate as any).mockRejectedValue(new Error('network error'));

    render(<CsvUpload onFileSelect={vi.fn()} onRemove={vi.fn()} selectedFile={null} />);

    fireEvent.click(screen.getByRole('button', { name: /télécharger le template/i }));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'destructive', title: expect.stringMatching(/téléchargement impossible/i) })
      );
    });
  });
});
