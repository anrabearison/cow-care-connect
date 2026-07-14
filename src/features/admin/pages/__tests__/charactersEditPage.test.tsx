import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import CharactersEditPage from '../CharactersEditPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
const { mockUseCharacter } = vi.hoisted(() => ({ mockUseCharacter: vi.fn() }));
const { mockUseUpdateCharacter } = vi.hoisted(() => ({ mockUseUpdateCharacter: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('@/features/admin/hooks/charactersHooks', () => ({
  useCharacter: () => mockUseCharacter(),
  useUpdateCharacter: () => mockUseUpdateCharacter(),
}));

describe('CharactersEditPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseCharacter.mockReturnValue({
      data: { data: { id: '1', name: 'Test Character', description: 'Test description' } },
      isLoading: false,
      error: null,
    });
    mockUseUpdateCharacter.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the edit page with title', () => {
    render(
      <TestWrapper>
        <CharactersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Modifier le caractère')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseCharacter.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <CharactersEditPage />
      </TestWrapper>
    );
  });

  it('renders form with data when available', () => {
    render(
      <TestWrapper>
        <CharactersEditPage />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test Character')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('shows error state when data not found', () => {
    mockUseCharacter.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
    });

    render(
      <TestWrapper>
        <CharactersEditPage />
      </TestWrapper>
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Caractère introuvable')).toBeInTheDocument();
  });
});
