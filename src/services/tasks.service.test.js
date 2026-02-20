import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as tasksService from './tasks.service';

vi.mock('./api', () => {
  const mockApi = {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: { baseURL: 'https://api.taiga.io/api/v1' },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: mockApi };
});

describe('Tasks Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listTasks', () => {
    it('should fetch tasks with params', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: [{ id: 1 }] });

      const result = await tasksService.listTasks({ project: 1 });

      expect(api.get).toHaveBeenCalledWith('/tasks', { params: { project: 1 } });
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('listInAllProjects', () => {
    it('should fetch tasks across all projects without pagination', async () => {
      const { default: api } = await import('./api');
      api.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

      const result = await tasksService.listInAllProjects({ status: 1 });

      expect(api.get).toHaveBeenCalledWith('/tasks', {
        params: { status: 1 },
        headers: { 'x-disable-pagination': '1' },
      });
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getTask', () => {
    it('should fetch a single task by id', async () => {
      const { default: api } = await import('./api');
      const mockTask = { id: 1, subject: 'Test task' };
      api.get.mockResolvedValue({ data: mockTask });

      const result = await tasksService.getTask(1);

      expect(api.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const { default: api } = await import('./api');
      const taskData = { subject: 'New task', project: 1 };
      api.post.mockResolvedValue({ data: { id: 1, ...taskData } });

      const result = await tasksService.createTask(taskData);

      expect(api.post).toHaveBeenCalledWith('/tasks', taskData);
      expect(result).toEqual({ id: 1, ...taskData });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const { default: api } = await import('./api');
      api.patch.mockResolvedValue({ data: { id: 1, subject: 'Updated' } });

      const result = await tasksService.updateTask(1, { subject: 'Updated' });

      expect(api.patch).toHaveBeenCalledWith('/tasks/1', { subject: 'Updated' });
      expect(result).toEqual({ id: 1, subject: 'Updated' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const { default: api } = await import('./api');
      api.delete.mockResolvedValue({ data: {} });

      await tasksService.deleteTask(1);

      expect(api.delete).toHaveBeenCalledWith('/tasks/1');
    });
  });

  describe('getTaskByRef', () => {
    it('should fetch a task by project and ref', async () => {
      const { default: api } = await import('./api');
      const mockTask = { id: 1, ref: 42, project: 1 };
      api.get.mockResolvedValue({ data: mockTask });

      const result = await tasksService.getTaskByRef(1, 42);

      expect(api.get).toHaveBeenCalledWith('/tasks/by_ref', {
        params: { project: 1, ref: 42 },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('bulkCreateTasks', () => {
    it('should bulk create tasks', async () => {
      const { default: api } = await import('./api');
      api.post.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

      const result = await tasksService.bulkCreateTasks(1, 1, 'Task 1\nTask 2');

      expect(api.post).toHaveBeenCalledWith('/tasks/bulk_create', {
        project_id: 1,
        milestone_id: 1,
        bulk_tasks: 'Task 1\nTask 2',
      });
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
});
