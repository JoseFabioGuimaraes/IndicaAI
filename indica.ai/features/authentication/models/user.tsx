export interface User {
  id: string;
  name: string;
  email: string;
  type: "worker" | "company";
  cpf?: string;
  cnpj?: string;
}
