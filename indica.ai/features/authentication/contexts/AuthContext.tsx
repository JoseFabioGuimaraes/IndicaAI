"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { User } from "../models/user";
import { RegisterDTO } from "@/lib/schemas/register.schema";
import { LoginDTO } from "@/lib/schemas/login.schema";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "../services/auth.service";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
  logoutToSelection: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const loadUser = useCallback(() => {
    const storedUser = localStorage.getItem("auth:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user and not on a public auth page, redirect to selection
      // This logic might need refinement to avoid infinite loops or blocking public pages
      // For now, we'll rely on the protected routes logic or specific page checks
      // But the requirement says: "If no user... redirect to page to select..."
      const publicRoutes = ["/selection", "/login", "/register"];
      // Check if current path starts with any public route (simple check)
      const isPublic = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      if (!isPublic && pathname !== "/") {
        router.push("/selection");
      }
    }
    setLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function login(data: LoginDTO) {
    setLoading(true);
    try {
      const { user, token } = await AuthService.login(data);
      setUser(user);
      localStorage.setItem("auth:user", JSON.stringify(user));
      localStorage.setItem("auth:token", token);

      if (user.status === "PENDENTE_VALIDACAO") {
        router.push("/pending-approval");
      } else {
        router.push("/profile"); // Redirect to profile
      }
    } catch (error) {
      console.error("Login failed", error);
      // Handle error (toast etc)
    } finally {
      setLoading(false);
    }
  }

  async function register(data: RegisterDTO) {
    setLoading(true);
    try {
      const user = await AuthService.register(data);
      setUser(user);
      localStorage.setItem("auth:user", JSON.stringify(user));

      if (user.status === "PENDENTE_VALIDACAO") {
        router.push("/pending-approval");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    const userType = user?.type;
    setUser(null);
    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");

    if (userType === "worker") {
      router.push("/login?type=worker");
    } else {
      router.push("/selection");
    }
  }

  function logoutToSelection() {
    setUser(null);
    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");
    router.push("/selection");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, logoutToSelection }}>
      {children}
    </AuthContext.Provider>
  );
}
