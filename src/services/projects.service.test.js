import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as projectsService from './projects.service';

vi.mock('./api', () => {
  const mockApi = {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { baseURL: 'https://api.taiga.io/api/v1' },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: mockApi };
});

describe('Projects Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a project', async () => {
      const { default: api } = await import('./api');
      const projectData = { name: 'Test Project', description: 'A test project' };
      api.post.mockResolvedValue({ data: { id: 1, ...projectData } });

      const result = await projectsService.createProject(projectData);

      expect(api.post).toHaveBeenCalledWith('/projects', projectData);
      expect(result).toEqual({ id: 1, ...projectData });
    });
  });

  describe('duplicateProject', () => {
    it('should duplicate a project with formatted members', async () => {
      const { default: api } = await import('./api');
      const data = {
        name: 'Copy',
        description: 'Duplicate',
        is_private: false,
        users: [1, 2, 3],
      };
      api.post.mockResolvedValue({ data: { id: 2 } });

      await projectsService.duplicateProject(1, data);

      expect(api.post).toHaveBeenCalledWith('/projects/1/duplicate', {
        name: 'Copy',
        description: 'Duplicate',
        is_private: false,
        users: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });
    });
  });

  describe('getProjects', () => {
    it('should fetch projects with pagination', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: [{ id: 1 }] });

      const result = await projectsService.getProjects();

      expect(api.get).toHaveBeenCalledWith('/projects', { params: {}, headers: {} });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('should fetch projects without pagination', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: [{ id: 1 }] });

      await projectsService.getProjects({}, false);

      expect(api.get).toHaveBeenCalledWith('/projects', {
        params: {},
        headers: { 'x-lazy-pagination': true },
      });
    });
  });

  describe('getProjectBySlug', () => {
    it('should fetch a project by slug', async () => {
      const { default: api } = await import('./api');
      const mockProject = { id: 1, slug: 'test-project' };
      api.get.mockResolvedValue({ data: mockProject });

      const result = await projectsService.getProjectBySlug('test-project');

      expect(api.get).toHaveBeenCalledWith('/projects/by_slug?slug=test-project');
      expect(result).toEqual(mockProject);
    });
  });

  describe('getProjectsByUserId', () => {
    it('should fetch projects for a user without pagination', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: [] });

      await projectsService.getProjectsByUserId(1);

      expect(api.get).toHaveBeenCalledWith('/projects', {
        params: { member: 1, order_by: 'user_order' },
        headers: { 'x-disable-pagination': '1' },
      });
    });

    it('should fetch projects with pagination when specified', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: [] });

      await projectsService.getProjectsByUserId(1, true);

      expect(api.get).toHaveBeenCalledWith('/projects', {
        params: { member: 1, order_by: 'user_order' },
        headers: {},
      });
    });
  });

  describe('getProjectStats', () => {
    it('should fetch project stats', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: { id: 1, stats: {} } });

      const result = await projectsService.getProjectStats(1);

      expect(api.get).toHaveBeenCalledWith('/projects/1');
      expect(result).toEqual({ id: 1, stats: {} });
    });
  });

  describe('likeProject', () => {
    it('should like a project', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.likeProject(1);

      expect(api.post).toHaveBeenCalledWith('/projects/1/like');
    });
  });

  describe('unlikeProject', () => {
    it('should unlike a project', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.unlikeProject(1);

      expect(api.post).toHaveBeenCalledWith('/projects/1/unlike');
    });
  });

  describe('watchProject', () => {
    it('should watch a project with notify level', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.watchProject(1, 2);

      expect(api.post).toHaveBeenCalledWith('/projects/1/watch', {
        notify_level: 2,
        live_notify_level: 2,
      });
    });
  });

  describe('unwatchProject', () => {
    it('should unwatch a project', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.unwatchProject(1);

      expect(api.post).toHaveBeenCalledWith('/projects/1/unwatch');
    });
  });

  describe('contactProject', () => {
    it('should send a contact message', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.contactProject(1, 'Hello');

      expect(api.post).toHaveBeenCalledWith('/contact', {
        project: 1,
        comment: 'Hello',
      });
    });
  });

  describe('bulkUpdateOrder', () => {
    it('should send bulk update order', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });
      const bulkData = [{ project_id: 1, order: 1 }];

      await projectsService.bulkUpdateOrder(bulkData);

      expect(api.post).toHaveBeenCalledWith('/bulk-update-projects-order', bulkData);
    });
  });

  describe('getTimeline', () => {
    it('should fetch project timeline', async () => {
      const { default: api } = await import('./api');
      const mockData = [{ id: 1 }];
      api.get.mockResolvedValue({ data: mockData, headers: {} });

      const result = await projectsService.getTimeline(1, 1);

      expect(api.get).toHaveBeenCalledWith('/timeline/project/1', {
        params: { page: 1, only_relevant: true },
        headers: { 'x-lazy-pagination': true },
      });
      expect(result).toEqual({ data: mockData, headers: {} });
    });
  });

  describe('transferValidateToken', () => {
    it('should validate transfer token', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.transferValidateToken(1, 'token123');

      expect(api.post).toHaveBeenCalledWith('/projects/1/transfer_validate_token', {
        token: 'token123',
      });
    });
  });

  describe('transferStart', () => {
    it('should start project transfer', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: {} });

      await projectsService.transferStart(1, 2, 'Moving project');

      expect(api.post).toHaveBeenCalledWith('/projects/1/transfer_start', {
        user: 2,
        reason: 'Moving project',
      });
    });
  });
});
