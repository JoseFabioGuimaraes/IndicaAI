"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { Building2, User } from "lucide-react";
import AuthLayout from "@/features/authentication/layouts/AuthLayout";

export function SelectionType() {
  return (
    <AuthLayout title="Bem-vindo ao Indica.ai">
      <div className="grid gap-6 w-2xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/login?type=worker" className="block h-full">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sou Trabalhador</CardTitle>
                <CardDescription>
                  Quero saber como está minha reputação.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </Link>

          <Link href="/login?type=company" className="block h-full">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sou Empresa</CardTitle>
                <CardDescription>
                  Quero saber o que outras empresas pensam de seus
                  trabalhadores.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>

        <div className="text-center text-sm">
          Ainda não tem conta?{" "}
          <Link href="/register" className="underline hover:text-primary">
            Cadastre-se
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
