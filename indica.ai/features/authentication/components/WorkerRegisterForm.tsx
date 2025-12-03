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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Upload } from "lucide-react";

export default function WorkerRegisterForm() {
  const { register, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      motherName: "",
      birthDate: "",
    },
    mode: "onChange",
  });

  const steps = [
    { id: 1, label: "Dados Pessoais" },
    { id: 2, label: "Documento (Frente)" },
    { id: 3, label: "Documento (Verso)" },
  ];

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger([
        "name",
        "email",
        "password",
        "confirmPassword",
        "cpf",
        "motherName",
        "birthDate",
      ]);
    } else if (step === 2) {
      // Validate file upload if needed, for now just check if field has value
      // isValid = await form.trigger("documentFront");
      // Manual check for file presence since zod trigger might be tricky with file input
      const file = form.getValues("documentFront");
      isValid = !!file && file.length > 0;
      if (!isValid) {
        form.setError("documentFront", { message: "Imagem é obrigatória." });
      }
    } else if (step === 3) {
      const file = form.getValues("documentBack");
      isValid = !!file && file.length > 0;
      if (!isValid) {
        form.setError("documentBack", { message: "Imagem é obrigatória." });
      }
    }

    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, step])]);
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Submit
        await form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleStepClick = (stepId: number) => {
    if (completedSteps.includes(stepId - 1) || stepId < step) {
      setStep(stepId);
    }
  };

  async function onSubmit(values: RegisterSchema) {
    await register(values);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Stepper */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
        {steps.map((s) => (
          <div
            key={s.id}
            className={cn(
              "flex flex-col items-center gap-2 cursor-pointer bg-background px-2",
              step === s.id ? "text-primary" : "text-muted-foreground",
              (completedSteps.includes(s.id) || step > s.id) && "text-primary"
            )}
            onClick={() => handleStepClick(s.id)}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                step === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground bg-background",
                (completedSteps.includes(s.id) || step > s.id) &&
                  "border-primary bg-primary text-primary-foreground"
              )}
            >
              {completedSteps.includes(s.id) || step > s.id ? (
                <Check className="w-4 h-4" />
              ) : (
                s.id
              )}
            </div>
            <span className="text-xs font-medium hidden sm:block">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Mãe</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da mãe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
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
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">
                  Foto do Documento (Frente)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Envie uma foto legível da frente do seu RG ou CNH.
                </p>
              </div>
              <FormField
                control={form.control}
                name="documentFront"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file-front"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors border-muted-foreground/25"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                Clique para enviar
                              </span>{" "}
                              ou arraste e solte
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG ou WEBP (MAX. 5MB)
                            </p>
                          </div>
                          <Input
                            id="dropzone-file-front"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                            }}
                            {...field}
                          />
                        </label>
                      </div>
                    </FormControl>
                    {value && value[0] && (
                      <p className="text-sm text-center text-primary mt-2">
                        Arquivo selecionado: {value[0].name}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">
                  Foto do Documento (Verso)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Envie uma foto legível do verso do seu RG ou CNH.
                </p>
              </div>
              <FormField
                control={form.control}
                name="documentBack"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file-back"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors border-muted-foreground/25"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                Clique para enviar
                              </span>{" "}
                              ou arraste e solte
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG ou WEBP (MAX. 5MB)
                            </p>
                          </div>
                          <Input
                            id="dropzone-file-back"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                            }}
                            {...field}
                          />
                        </label>
                      </div>
                    </FormControl>
                    {value && value[0] && (
                      <p className="text-sm text-center text-primary mt-2">
                        Arquivo selecionado: {value[0].name}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button
            type="button"
            onClick={handleNext}
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : step === 3 ? (
              "Finalizar Cadastro"
            ) : (
              "Avançar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
