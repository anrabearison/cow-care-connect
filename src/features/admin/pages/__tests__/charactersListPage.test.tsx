import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import CharactersListPage from '../CharactersListPage';

const { mockUseCharacters } = vi.hoisted(() => ({ mockUseCharacters: vi.fn() }));
const { mockUseCreateCharacter } = vi.hoisted(() => ({ mockUseCreateCharacter: vi.fn() }));
const { mockUseUpdateCharacter } = vi.hoisted(() => ({ mockUseUpdateCharacter: vi.fn() }));
const { mockUseDeleteCharacter } = vi.hoisted(() => ({ mockUseDeleteCharacter: vi.fn() }));

vi.mock('@/features/admin/hooks/charactersHooks', () => ({
  useCharacters: () => mockUseCharacters(),
  useCreateCharacter: () => mockUseCreateCharacter(),
  useUpdateCharacter: () => mockUseUpdateCharacter(),
  useDeleteCharacter: () => mockUseDeleteCharacter(),
}));

describe('CharactersListPage', () => {
  beforeEach(() => {
    mockUseCharacters.mockReturnValue({
      data: { data: [{ id: '1', name: 'Test Character', description: 'Test' }], total: 1 },
      isLoading: false,
    });
    mockUseCreateCharacter.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseUpdateCharacter.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseDeleteCharacter.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders the list page with title', () => {
    render(
      <TestWrapper>
        <CharactersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Caractères')).toBeInTheDocument();
    expect(screen.getByText('Gestion des caractères')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseCharacters.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <TestWrapper>
        <CharactersListPage />
      </TestWrapper>
    );
  });

  it('renders data when available', () => {
    render(
      <TestWrapper>
        <CharactersListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Character')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    mockUseCharacters.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
    });

    render(
      <TestWrapper>
        <CharactersListPage />
      </TestWrapper>
    );
  });
});
