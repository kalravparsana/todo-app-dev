import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { todoStore } from '@/lib/todoStore';
import { isApiEnabled, todoApi } from '@/lib/todoApi';
import type { AppState, Project, Task, TaskPriority } from '@/types/todo';

type TodoContextValue = {
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  error: string | null;
  addTask: (input: {
    title: string;
    projectId?: string;
    dueDate?: string;
    scheduledDate?: string;
    committedToToday?: boolean;
    priority?: TaskPriority;
  }) => void;
  toggleComplete: (taskId: string) => void;
  toggleTodayCommit: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addProject: (name: string, color: string) => void;
  deleteProject: (projectId: string) => void;
  getProjectById: (id: string) => Project | undefined;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => todoStore.load());
  const [loading, setLoading] = useState(isApiEnabled());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiEnabled()) return;

    let cancelled = false;
    (async () => {
      try {
        const [tasks, projects] = await Promise.all([
          todoApi.fetchTasks(),
          todoApi.fetchProjects(),
        ]);
        if (!cancelled) {
          setState({ tasks, projects });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isApiEnabled()) {
      todoStore.save(state);
    }
  }, [state]);

  const addTask = useCallback<TodoContextValue['addTask']>((input) => {
    if (isApiEnabled()) {
      todoApi
        .createTask(input)
        .then((task) => {
          setState((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to add task');
        });
      return;
    }
    setState((prev) => todoStore.addTask(prev, input));
  }, []);

  const toggleComplete = useCallback((taskId: string) => {
    setState((prev) => {
      const next = todoStore.toggleComplete(prev, taskId);
      if (isApiEnabled()) {
        const task = next.tasks.find((t) => t.id === taskId);
        if (task) {
          todoApi
            .updateTask(taskId, {
              completed: task.completed,
              completedAt: task.completedAt,
            })
            .catch((err) => {
              setError(err instanceof Error ? err.message : 'Failed to update task');
            });
        }
      }
      return next;
    });
  }, []);

  const toggleTodayCommit = useCallback((taskId: string) => {
    setState((prev) => {
      const next = todoStore.toggleTodayCommit(prev, taskId);
      if (isApiEnabled()) {
        const task = next.tasks.find((t) => t.id === taskId);
        if (task) {
          todoApi
            .updateTask(taskId, { committedToToday: task.committedToToday })
            .catch((err) => {
              setError(err instanceof Error ? err.message : 'Failed to update task');
            });
        }
      }
      return next;
    });
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setState((prev) => {
      const next = todoStore.updateTask(prev, taskId, updates);
      if (isApiEnabled()) {
        todoApi.updateTask(taskId, updates).catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to update task');
        });
      }
      return next;
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => todoStore.deleteTask(prev, taskId));
    if (isApiEnabled()) {
      todoApi.deleteTask(taskId).catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      });
    }
  }, []);

  const addProject = useCallback((name: string, color: string) => {
    if (isApiEnabled()) {
      todoApi
        .createProject(name, color)
        .then((project) => {
          setState((prev) => ({ ...prev, projects: [...prev.projects, project] }));
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to add project');
        });
      return;
    }
    setState((prev) => todoStore.addProject(prev, name, color));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setState((prev) => todoStore.deleteProject(prev, projectId));
    if (isApiEnabled()) {
      todoApi.deleteProject(projectId).catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to delete project');
      });
    }
  }, []);

  const getProjectById = useCallback(
    (id: string) => state.projects.find((p) => p.id === id),
    [state.projects],
  );

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      projects: state.projects,
      loading,
      error,
      addTask,
      toggleComplete,
      toggleTodayCommit,
      updateTask,
      deleteTask,
      addProject,
      deleteProject,
      getProjectById,
    }),
    [
      state.tasks,
      state.projects,
      loading,
      error,
      addTask,
      toggleComplete,
      toggleTodayCommit,
      updateTask,
      deleteTask,
      addProject,
      deleteProject,
      getProjectById,
    ],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
