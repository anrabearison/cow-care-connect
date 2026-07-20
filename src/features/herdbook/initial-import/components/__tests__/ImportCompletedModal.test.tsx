import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportCompletedModal } from '../ImportCompletedModal';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('ImportCompletedModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates to the specific herd book when herdBookId is known', () => {
    render(
      <ImportCompletedModal
        open={true}
        onClose={vi.fn()}
        herdBookName="HB-2024"
        herdBookId="hb-123"
        cattleCount={12}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /voir le livre de troupeau/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin/herd-books/hb-123');
  });

  it('falls back to the generic admin page when herdBookId is unknown', () => {
    render(<ImportCompletedModal open={true} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /aller à l'administration/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('also navigates to the herd book when the dialog is dismissed via onClose', () => {
    const onClose = vi.fn();
    render(
      <ImportCompletedModal
        open={true}
        onClose={onClose}
        herdBookId="hb-123"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /voir le livre de troupeau/i }));

    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/admin/herd-books/hb-123');
  });

  it('displays the herd book name and cattle count when provided', () => {
    render(
      <ImportCompletedModal
        open={true}
        onClose={vi.fn()}
        herdBookName="HB-2024"
        herdBookId="hb-123"
        cattleCount={12}
      />
    );

    expect(screen.getByText('HB-2024')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
