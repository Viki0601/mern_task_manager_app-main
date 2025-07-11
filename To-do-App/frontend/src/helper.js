import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const baseURL =
  import.meta.env.VITE_BACKEND_BASE_URL ||
  "https://task-management-e2yh.onrender.com" ||
  "http://localhost:3000";


const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

export const getTasks = () =>
  api.get("/tasks").then((response) => response.data);
export const createTask = (task) =>
  api.post("/tasks", task).then((response) => response.data);

export const useGetTasks = () =>
  useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      const optimisticTask = {
        ...newTask,
        id: Date.now().toString(),
        isNew: true,
      };
      queryClient.setQueryData(["tasks"], (old) => [
        ...(old || []),
        optimisticTask,
      ]);
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) =>
          task.isNew && task.content === variables.content
            ? { ...data, isNew: false }
            : task
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
