import { z } from "zod";

// Helper for file validation (basic check)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z
  .any()
  .refine((files) => files?.length == 1, "Imagem é obrigatória.")
  .refine(
    (files) => files?.[0]?.size <= MAX_FILE_SIZE,
    `Tamanho máximo de 5MB.`
  )
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "Formato de arquivo inválido. Apenas .jpg, .jpeg, .png e .webp são aceitos."
  );

export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres.").trim(),
  email: z.email({ message: "Informe um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha deve ter no mínimo 6 caracteres." }),
  
  // Worker specific fields
  cpf: z.string().optional(), // Validate format in component or custom zod rule
  motherName: z.string().optional(),
  birthDate: z.string().optional(), // ISO date string or similar
  
  // Company specific fields
  fantasyName: z.string().optional(),
  quadro: z.string().optional(), // "Quadro" as requested
  creationDate: z.string().optional(),
  contactEmail: z.email({ message: "Informe um e-mail de contato válido." }).optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  partners: z.array(z.object({ name: z.string().min(1, "Nome do sócio é obrigatório") })).optional(),
  
  // File uploads
  documentFront: z.any().optional(),
  documentBack: z.any().optional(),
  socialContract: z.any().optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  }
);

export type RegisterSchema = z.infer<typeof registerSchema>;

export type RegisterDTO = Omit<RegisterSchema, "confirmPassword">;