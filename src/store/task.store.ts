import { create } from 'zustand';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  tasksLoading: boolean;
  filteredTasks: Task[];
  selectedStatus: 'All' | 'In Progress' | 'Completed' | 'Assigned';
  addTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
  setSelectedStatus: (
    status: 'All' | 'In Progress' | 'Completed' | 'Assigned'
  ) => void;
  getFilteredTasks: () => Task[];
  updateTaskStatus: (
    taskId: string,
    status: 'In Progress' | 'Completed' | 'Assigned'
  ) => void;
  updateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  setTasksLoading: (loading: boolean) => void;
  removeTask: (taskId: string | undefined) => void;
  getTaskCount : () => Record<string, number>
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  tasksLoading: false,
  selectedStatus: 'All',
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  setTasks: (tasks) => set({ tasks, filteredTasks: tasks }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  getFilteredTasks: () => {
    const { tasks, selectedStatus } = get();
    if (selectedStatus === 'All') return tasks;
    return tasks.filter((task) => task.status === selectedStatus);
  },
  updateTaskStatus: (taskId, status) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) =>
      task._id === taskId.toString() ? { ...task, status } : task
    );
    set({ tasks: updatedTasks, filteredTasks: updatedTasks });
  },
  updateTask: (taskId, updatedFields) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, ...updatedFields } : task
    );
    set({ tasks: updatedTasks, filteredTasks: updatedTasks });
  },
  setTasksLoading: (loading) => set({ tasksLoading: loading }),
  removeTask: (taskId: string | undefined) => {
    const currentTasks = get().tasks;
    const updatedTasks = currentTasks.filter((task) => task._id !== taskId);
    set({ tasks: updatedTasks });
  },
  getTaskCount: () => {
    const { tasks } = get();
    return tasks.reduce((counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  },
}));

export default useTaskStore;
