import type { Task } from "./tasks";
import type { User } from "./user";

export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: T;
  token?: string;
  expires_at?: string | undefined;
}

export type RegisterResponse = ApiResponse<User>;

export interface LoginResponse extends ApiResponse<User> {
  token: string;
  expires_at: string;
}

export interface TaskResponse {
  status_code: number;
  message: string;
  data: Task[];
}