"use client";

import AuthLayout from "@/features/authentication/layouts/AuthLayout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RegisterForm from "@/features/authentication/components/RegisterForm";

function RegisterContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "worker" | "company" | null;
  const userType = type === "company" ? "company" : "worker";

  const title =
    userType === "company" ? "Cadastro Empresa" : "Cadastro Trabalhador";

  return (
    <AuthLayout title={title}>
      <RegisterForm type={userType} />
    </AuthLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
