import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrapData } from "@/lib/api";
import type { Pagination, Project, ProjectPayload } from "@/types/project";

type ProjectsListResponse = { projects: Project[]; pagination: Pagination };
type ProjectResponse = { project: Project };

export const useProjects = (page = 1, limit = 9) =>
  useQuery({
    queryKey: ["projects", page, limit],
    queryFn: async () =>
      unwrapData<ProjectsListResponse>(
        await api.get("/projects", { params: { page, limit } })
      ),
  });

export const useProjectBySlug = (slug: string) =>
  useQuery({
    queryKey: ["project", slug],
    enabled: Boolean(slug),
    queryFn: async () =>
      unwrapData<ProjectResponse>(await api.get(`/projects/${slug}`)),
  });

export const useAdminProjects = (page = 1, limit = 10, status = "all") =>
  useQuery({
    queryKey: ["admin-projects", page, limit, status],
    queryFn: async () =>
      unwrapData<ProjectsListResponse>(
        await api.get("/admin/projects", { params: { page, limit, status } })
      ),
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectPayload) =>
      unwrapData<ProjectResponse>(await api.post("/admin/projects", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ProjectPayload> }) =>
      unwrapData<ProjectResponse>(await api.patch(`/admin/projects/${id}`, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

