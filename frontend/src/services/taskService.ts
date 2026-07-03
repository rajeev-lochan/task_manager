import type { CreateTaskRequest } from "../types/tasks";
import api from "./api";

export const getAllTasks = async () => {
  const response = await api.get("/tasks/all_tasks");
  return response.data;
};

export const createTask = async (data: CreateTaskRequest) => {
  const response = await api.post("/tasks/create", data);
  return response.data;
};

export const updateTask = async (
  id: number,
  data: CreateTaskRequest
) => {
  return api.put(`/tasks/${id}`, data);
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};