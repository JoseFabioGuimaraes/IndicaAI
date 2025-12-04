"use client";

import { registerSchema, RegisterSchema } from "@/lib/schemas/register.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@/shared/components/ui/spinner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function CompanyRegisterForm() {
  const { register, loading } = useAuth();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      fantasyName: "",
      cnpj: "",
    },
    mode: "onChange",
  });




  const handleNext = async () => {
    const isValid = await form.trigger([
      "name",
      "email",
      "password",
      "confirmPassword",
      "fantasyName",
      "cnpj",
    ]);

    if (isValid) {
      // Submit
      await form.handleSubmit(onSubmit)();
    }
  };


  async function onSubmit(values: RegisterSchema) {
    await register(values);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Stepper */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Dados da Empresa</h2>
        <p className="text-muted-foreground mt-2">
          Preencha as informações abaixo para criar sua conta empresarial.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão Social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fantasyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Fantasia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de Login</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <Button
            type="button"
            onClick={handleNext}
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : (
              "Finalizar Cadastro"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
