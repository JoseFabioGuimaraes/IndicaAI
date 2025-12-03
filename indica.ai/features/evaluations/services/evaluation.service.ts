import axios from "axios";
import { Review } from "@/lib/schemas/profile.schema";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

interface MetricasAvaliacao {
    notaAssiduidade: number;
    notaTecnica: number;
    notaComportamental: number;
}

interface DetalhamentoAvaliacaoDTO {
    id: string;
    nomeEmpresa: string;
    nomeFuncionario: string;
    metricas: MetricasAvaliacao;
    descricao: string;
    resposta: string;
    dataAvaliacao: string;
}

export class EvaluationService {
    static async getMyEvaluations(): Promise<Review[]> {
        const token = localStorage.getItem("auth:token");
        if (!token) return [];

        try {
            const response = await api.get<DetalhamentoAvaliacaoDTO[]>("/avaliacoes/minhas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.map((dto) => {
                // Calculate average rating
                const average =
                    (dto.metricas.notaAssiduidade +
                        dto.metricas.notaTecnica +
                        dto.metricas.notaComportamental) /
                    3;

                return {
                    id: dto.id,
                    authorId: "company-placeholder", // We don't have company ID in DTO, using placeholder
                    authorName: dto.nomeEmpresa,
                    targetId: "user-placeholder", // We don't have user ID in DTO, using placeholder
                    rating: Math.round(average * 10) / 10, // Round to 1 decimal
                    comment: dto.descricao,
                    reply: dto.resposta,
                    createdAt: new Date(dto.dataAvaliacao),
                };
            });
        } catch (error) {
            console.error("Failed to fetch evaluations", error);
            return [];
        }
    }
}
