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

interface EmpresaResponse {
  id: string;
  razaoSocial: string;
  email: string;
  cnpj: string;
  status: string;
  nomeFantasia: string;
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
      const user = await this.getProfile(token);

      return { user, token };
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }

  static async getProfile(token: string): Promise<User> {
    // 2. Try to get User Details (Worker first, then Company)
    try {
      const userResponse = await api.get<FuncionarioResponse>("/funcionarios/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const funcionario = userResponse.data;

      return {
        id: funcionario.id,
        name: funcionario.nomeCompleto,
        email: funcionario.email,
        type: "worker",
        cpf: funcionario.cpf,
        city: funcionario.cidade,
        bio: funcionario.sobre,
        status: funcionario.status,
      };
    } catch (workerError) {
      // If worker fetch fails, try company
      try {
        const companyResponse = await api.get<EmpresaResponse>("/empresas/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const empresa = companyResponse.data;

        return {
          id: empresa.id,
          name: empresa.razaoSocial,
          email: empresa.email,
          type: "company",
          cnpj: empresa.cnpj,
          city: empresa.cidade,
          bio: empresa.sobre,
          status: empresa.status,
        };
      } catch (companyError) {
        console.error("Failed to fetch user details for both worker and company", companyError);
        throw new Error("Failed to retrieve user profile");
      }
    }
  }

  static async register(data: RegisterDTO): Promise<User> {
    try {
      if (data.cnpj) {
        // Company Registration
        const payload = {
          razaoSocial: data.name,
          email: data.email,
          senha: data.password,
          cnpj: data.cnpj,
          nomeFantasia: data.fantasyName,
        };

        const response = await api.post<EmpresaResponse>("/empresas/cadastro", payload);
        const empresa = response.data;

        return {
          id: empresa.id,
          name: empresa.razaoSocial,
          email: empresa.email,
          type: "company",
          cnpj: empresa.cnpj,
          city: empresa.cidade,
          bio: empresa.sobre,
          status: empresa.status,
        };
      } else {
        // Worker Registration
        // 1. Convert images to Base64
        const facePhotoBase64 = data.facePhoto && data.facePhoto[0] ? await this.toBase64(data.facePhoto[0]) : "";
        const documentPhotoBase64 = data.documentPhoto && data.documentPhoto[0] ? await this.toBase64(data.documentPhoto[0]) : "";

        // 2. Prepare payload
        const payload = {
          nomeCompleto: data.name,
          email: data.email,
          senha: data.password,
          cpf: data.cpf,
          cidade: data.city,
          fotoRostoUrl: facePhotoBase64,
          fotoDocumentoUrl: documentPhotoBase64,
          sobre: "",
        };

        // 3. Call API
        const response = await api.post<FuncionarioResponse>("/funcionarios/cadastro", payload);
        const funcionario = response.data;

        // 4. Map to User model
        return {
          id: funcionario.id,
          name: funcionario.nomeCompleto,
          email: funcionario.email,
          type: "worker",
          cpf: funcionario.cpf,
          city: funcionario.cidade,
          bio: funcionario.sobre,
          status: funcionario.status,
        };
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  static async updateWorkerProfile(id: string, data: Partial<FuncionarioResponse>): Promise<FuncionarioResponse> {
    const token = localStorage.getItem("auth:token");
    const response = await api.put<FuncionarioResponse>(`/funcionarios/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  private static toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}
