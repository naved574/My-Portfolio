import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrapData } from "@/lib/api";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type ContactResponse = { contactMessages: ContactMessage[] };

export const useAdminMessages = () =>
  useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () =>
      unwrapData<ContactResponse>(await api.get("/admin/contact-messages")),
  });

export const useMarkMessageRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      unwrapData(await api.patch(`/admin/contact-messages/${id}/read`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrapData(await api.delete(`/admin/contact-messages/${id}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
};
