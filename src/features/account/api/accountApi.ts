import { request } from "@/shared/api/client";

export const accountApi = {
  deleteUser: async () => {
    await request<void>({ method: "DELETE", url: "/api/users" });
  },
};
