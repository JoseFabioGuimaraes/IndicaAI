import axios from "axios";
import { LoginDTO } from "@/lib/schemas/login.schema";
import { RegisterDTO } from "@/lib/schemas/register.schema";
import { User } from "../models/user";

// Configure base URL if needed, or use relative paths for Next.js API routes
const api = axios.create({
  baseURL: "/api", // Adjust based on your API setup
});

export class AuthService {
  static async login(data: LoginDTO): Promise<User> {
    // Mock implementation for now as requested, but structured for axios
    // const response = await api.post<User>("/auth/login", data);
    // return response.data;

    // Mock return
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
            id: "mock-id",
            name: "Mock User",
            email: data.email,
            type: "worker", // Default mock type
        });
      }, 1000);
    });
  }

  static async register(data: RegisterDTO): Promise<User> {
    // const response = await api.post<User>("/auth/register", data);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
            id: "mock-new-id",
            name: data.name,
            email: data.email,
            type: "worker", // Default mock type
        });
      }, 1000);
    });
  }
}
