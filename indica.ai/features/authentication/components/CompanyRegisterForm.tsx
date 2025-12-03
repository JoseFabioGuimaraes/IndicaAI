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
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@/shared/components/ui/spinner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Upload, Plus, Trash2 } from "lucide-react";

export default function CompanyRegisterForm() {
  const { register, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [partnerCount, setPartnerCount] = useState<number>(0);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      fantasyName: "",
      quadro: "",
      creationDate: "",
      contactEmail: "",
      contactPhone: "",
      partners: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "partners",
  });

  // Effect to sync partner count with field array
  useEffect(() => {
    const currentLength = fields.length;
    if (partnerCount > currentLength) {
      for (let i = currentLength; i < partnerCount; i++) {
        append({ name: "" });
      }
    } else if (partnerCount < currentLength) {
      // Remove from the end
      for (let i = currentLength - 1; i >= partnerCount; i--) {
        remove(i);
      }
    }
  }, [partnerCount, append, remove, fields.length]);

  const steps = [
    { id: 1, label: "Dados da Empresa" },
    { id: 2, label: "Quadro Societário" },
    { id: 3, label: "Contrato Social" },
  ];

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger([
        "name",
        "email",
        "password",
        "confirmPassword",
        "fantasyName",
        "quadro",
        "creationDate",
        "contactEmail",
        "contactPhone",
      ]);
    } else if (step === 2) {
      isValid = await form.trigger("partners");
      if (partnerCount === 0) {
        form.setError("partners", {
          message: "Adicione pelo menos um sócio ou defina o número de sócios.",
        });
        isValid = false;
      }
    } else if (step === 3) {
      const file = form.getValues("socialContract");
      isValid = !!file && file.length > 0;
      if (!isValid) {
        form.setError("socialContract", { message: "Arquivo é obrigatório." });
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
                name="quadro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quadro</FormLabel>
                    <FormControl>
                      <Input placeholder="Quadro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Criação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="contato@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 0000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">Quadro Societário</h3>
                <p className="text-sm text-muted-foreground">
                  Informe o número de sócios e seus nomes.
                </p>
              </div>

              <FormItem>
                <FormLabel>Número de Sócios</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={partnerCount}
                    onChange={(e) =>
                      setPartnerCount(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
              </FormItem>

              <div className="space-y-3 mt-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`partners.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Nome do Sócio {index + 1}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Nome do Sócio ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {fields.length === 0 && partnerCount > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Preencha o número de sócios acima.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">Contrato Social</h3>
                <p className="text-sm text-muted-foreground">
                  Envie o arquivo do contrato social da empresa.
                </p>
              </div>
              <FormField
                control={form.control}
                name="socialContract"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file-contract"
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
                              PDF, PNG ou JPG (MAX. 5MB)
                            </p>
                          </div>
                          <Input
                            id="dropzone-file-contract"
                            type="file"
                            className="hidden"
                            accept=".pdf,image/*"
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
