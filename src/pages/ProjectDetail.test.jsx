import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';

// Mock react-router-dom's useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ slug: 'test-project' })),
  };
});

// Mock API service functions
vi.mock('../services/api', () => ({
  fetchProjectBySlug: vi.fn(),
  fetchProjectStats: vi.fn(),
}));

import { useParams } from 'react-router-dom';
import { fetchProjectBySlug, fetchProjectStats } from '../services/api';

const mockProject = {
  id: 1,
  name: 'Test Project',
  slug: 'test-project',
  description: 'A test project description',
  logo_big_url: 'https://example.com/logo.png',
  created_date: '2024-01-15T10:00:00Z',
  modified_date: '2024-06-20T15:30:00Z',
  is_private: false,
  is_looking_for_people: true,
  total_fans: 42,
  total_watchers: 18,
  total_activity_last_year: 156,
  tags: [
    ['react', '#61DAFB'],
    ['javascript', '#F7DF1E'],
  ],
  members: [
    {
      id: 101,
      full_name: 'Jane Doe',
      role_name: 'Product Owner',
      photo: 'https://example.com/jane.png',
      username: 'janedoe',
    },
    {
      id: 102,
      full_name: 'John Smith',
      role_name: 'Developer',
      photo: 'https://example.com/john.png',
      username: 'johnsmith',
    },
  ],
};

const mockStats = {
  total_milestones: 5,
  total_points: 120,
};

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={['/project/test-project']}>
      <ProjectDetail />
    </MemoryRouter>
  );
};

describe('ProjectDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ slug: 'test-project' });
  });

  it('renders a loading state initially', () => {
    fetchProjectBySlug.mockReturnValue(new Promise(() => {})); // never resolves
    renderComponent();
    expect(screen.getByText('Loading project...')).toBeInTheDocument();
  });

  it('displays project data after successful API fetch', async () => {
    fetchProjectBySlug.mockResolvedValue(mockProject);
    fetchProjectStats.mockResolvedValue(mockStats);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Description
    expect(screen.getByText('A test project description')).toBeInTheDocument();

    // Stats
    expect(screen.getByText('42')).toBeInTheDocument(); // fans
    expect(screen.getByText('18')).toBeInTheDocument(); // watchers
    expect(screen.getByText('156')).toBeInTheDocument(); // activity
    expect(screen.getByText('5')).toBeInTheDocument(); // milestones
    expect(screen.getByText('120')).toBeInTheDocument(); // points

    // Tags
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();

    // Members
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Product Owner')).toBeInTheDocument();
    expect(screen.getByText('@janedoe')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();

    // Metadata
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument(); // looking for people
  });

  it('shows an error message when the API call fails', async () => {
    fetchProjectBySlug.mockRejectedValue(new Error('Network error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Failed to load project. It may not exist or is not accessible.')
    ).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', async () => {
    fetchProjectBySlug.mockResolvedValue(mockProject);
    fetchProjectStats.mockResolvedValue(mockStats);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    const backlogLink = screen.getByText('Backlog').closest('a');
    const kanbanLink = screen.getByText('Kanban').closest('a');
    const wikiLink = screen.getByText('Wiki').closest('a');
    const issuesLink = screen.getByText('Issues').closest('a');

    expect(backlogLink).toHaveAttribute('href', '/project/test-project/backlog');
    expect(kanbanLink).toHaveAttribute('href', '/project/test-project/kanban');
    expect(wikiLink).toHaveAttribute('href', '/project/test-project/wiki');
    expect(issuesLink).toHaveAttribute('href', '/project/test-project/issues');
  });

  it('displays team members section with correct count', async () => {
    fetchProjectBySlug.mockResolvedValue(mockProject);
    fetchProjectStats.mockResolvedValue(mockStats);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Team Members (2)')).toBeInTheDocument();
    });
  });

  it('still renders project data when stats fetch fails', async () => {
    fetchProjectBySlug.mockResolvedValue(mockProject);
    fetchProjectStats.mockRejectedValue(new Error('Stats error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Project data should still be visible
    expect(screen.getByText('42')).toBeInTheDocument(); // fans from project data
    // Stats-only values should not be present
    expect(screen.queryByText('Milestones')).not.toBeInTheDocument();
  });
});
