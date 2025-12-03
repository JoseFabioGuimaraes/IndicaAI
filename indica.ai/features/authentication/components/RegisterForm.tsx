"use client";

import WorkerRegisterForm from "./WorkerRegisterForm";
import CompanyRegisterForm from "./CompanyRegisterForm";

interface RegisterFormProps {
  type?: "worker" | "company";
}

export default function RegisterForm({ type = "worker" }: RegisterFormProps) {
  if (type === "worker") {
    return <WorkerRegisterForm />;
  }
  return <CompanyRegisterForm />;
}
