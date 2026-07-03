import type { LoginRequest, RegisterRequest } from "../types/authApi";
import api from "./api";

export const login = async (data: LoginRequest) => {
  const response = await api.post("/user/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/user/register", data);
  return response.data;
};
