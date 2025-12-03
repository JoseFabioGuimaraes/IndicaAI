import z from "zod";

export const loginSchema = z.object({
    email: z.string().pipe(
        z.email({ message: "Informe um e-mail válido."})
    ),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
});

export type LoginSchema = z.infer<typeof loginSchema>;

export type LoginDTO = LoginSchema;