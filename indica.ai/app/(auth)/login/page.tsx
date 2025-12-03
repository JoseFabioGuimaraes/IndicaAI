"use client";

import LoginForm from "@/features/authentication/components/LoginForm";
import AuthLayout from "@/features/authentication/layouts/AuthLayout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "worker" | "company" | null;
  const userType = type === "company" ? "company" : "worker";

  const title = userType === "company" ? "Login Empresa" : "Login Trabalhador";

  return (
    <AuthLayout title={title}>
      <LoginForm type={userType} />
    </AuthLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
