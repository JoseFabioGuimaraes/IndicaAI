import axios from "axios";
import { LoginDTO } from "@/lib/schemas/login.schema";
import { RegisterDTO } from "@/lib/schemas/register.schema";
import { User } from "../models/user";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

interface TokenResponse {
  token: string;
}

interface FuncionarioResponse {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
  status: string;
  cidade: string;
  sobre: string;
}

export class AuthService {
  static async login(data: LoginDTO): Promise<{ user: User; token: string }> {
    try {
      // 1. Authenticate and get token
      const loginResponse = await api.post<TokenResponse>("/login", {
        email: data.email,
        senha: data.password, // Map 'password' to 'senha'
      });

      const token = loginResponse.data.token;

      // 2. Get User Details
      const userResponse = await api.get<FuncionarioResponse>("/funcionarios/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const funcionario = userResponse.data;

      // 3. Map to User model
      const user: User = {
        id: funcionario.id,
        name: funcionario.nomeCompleto,
        email: funcionario.email,
        type: "worker", // Assuming worker for now as per task
        cpf: funcionario.cpf,
        city: funcionario.cidade,
        bio: funcionario.sobre,
      };

      return { user, token };
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }

  static async register(data: RegisterDTO): Promise<User> {
    // Keeping mock for register as we are focusing on login
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "mock-new-id",
          name: data.name,
          email: data.email,
          type: "worker",
        });
      }, 1000);
    });
  }
}
