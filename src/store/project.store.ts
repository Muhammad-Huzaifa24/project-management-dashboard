import { create } from 'zustand';
import { Project } from '../types';

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  filterStatus: 'All' | 'Pending' | 'In Progress' | 'Completed';
  filteredProjects: Project[];
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project) => void;
  setFilterStatus: (
    status: 'All' | 'Pending' | 'In Progress' | 'Completed'
  ) => void;
  addProject: (project: Project) => void;
  getProjectCount : () => Record<string, number>;
}

const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  filterStatus: 'All', // Default filter status
  filteredProjects: [],

  setProjects: (projects) => {
    const validProjects = Array.isArray(projects) ? projects : []; // ✅ Ensure it's an array
    const { filterStatus } = get();
    const filteredProjects =
      filterStatus === 'All'
        ? validProjects
        : validProjects.filter((project) => project.status === filterStatus);
    set({ projects: validProjects, filteredProjects });
  },


  setSelectedProject: (project) => set({ selectedProject: project }),

  setFilterStatus: (status) => {
    const { projects } = get();
    const filteredProjects =
      status === 'All'
        ? projects
        : projects.filter((project) => project.status === status);
    set({ filterStatus: status, filteredProjects });
  },
  addProject: (newProject: Project) =>
    set((state) => ({
      projects: [...state.projects, newProject],
      filteredProjects:
        state.filterStatus === 'All'
          ? [...state.projects, newProject]
          : state.filterStatus === newProject.status
            ? [...state.filteredProjects, newProject]
            : state.filteredProjects,
    })),
    getProjectCount: () => {
      const { projects } = get();
      if (!Array.isArray(projects)) return {}; // ✅ Prevent errors if projects is undefined/null

      return projects.reduce((counts, project) => {
        counts[project.status] = (counts[project.status] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
    },

}));

export default useProjectStore;
