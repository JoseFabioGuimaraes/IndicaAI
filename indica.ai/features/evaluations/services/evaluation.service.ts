import axios from "axios";
import { Review } from "@/lib/schemas/profile.schema";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

interface DetalhamentoAvaliacaoDTO {
    id: string;
    nomeEmpresa: string;
    nomeFuncionario: string;
    nota: number;
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
                return {
                    id: dto.id,
                    authorId: "company-placeholder", // We don't have company ID in DTO, using placeholder
                    authorName: dto.nomeEmpresa,
                    targetId: "user-placeholder", // We don't have user ID in DTO, using placeholder
                    rating: dto.nota ? dto.nota : 0, // Use nota directly
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

    static async replyToEvaluation(token: string, evaluationId: string, reply: string): Promise<void> {
        await api.post(`/avaliacoes/${evaluationId}/responder`, { resposta: reply }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
