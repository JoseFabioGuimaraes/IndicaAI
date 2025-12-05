import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

export interface Evaluation {
    id: string;
    nomeEmpresa: string;
    nomeFuncionario: string;
    metricas: {
        assiduidade: number;
        tecnica: number;
        comportamental: number;
    };
    descricao: string;
    resposta: string | null;
    dataAvaliacao: string;
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
};
