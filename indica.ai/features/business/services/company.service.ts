import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

export interface Evaluation {
    id: string;
    nomeEmpresa: string;
    nomeFuncionario: string;
    nota: number;
    descricao: string;
    resposta: string | null;
    dataAvaliacao: string;
}

export interface Worker {
    id: string;
    nomeCompleto: string;
    email: string;
    cpf: string;
    cidade: string;
    sobre: string;
    status: string;
    fotoRostoUrl: string;
}

export const CompanyService = {
    getEvaluations: async (token: string): Promise<Evaluation[]> => {
        const response = await api.get<Evaluation[]>("/avaliacoes/minhas-avaliacoes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    searchWorkers: async (token: string, term: string): Promise<Worker[]> => {
        const response = await api.get<Worker[]>("/funcionarios/buscar", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                termo: term,
            },
        });
        return response.data;
    },

    getWorkerById: async (token: string, id: string): Promise<Worker> => {
        const response = await api.get<Worker>(`/funcionarios/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getWorkerEvaluations: async (token: string, workerId: string): Promise<Evaluation[]> => {
        const response = await api.get<Evaluation[]>(`/avaliacoes/funcionario/${workerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    createEvaluation: async (token: string, data: CreateEvaluationDTO): Promise<Evaluation> => {
        const response = await api.post<Evaluation>("/avaliacoes/criar", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export interface CreateEvaluationDTO {
    funcionarioId: string;
    empresaId: string;
    nota: number;
    descricao: string;
}
