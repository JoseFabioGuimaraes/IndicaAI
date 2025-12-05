"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CompanyService, Worker, Evaluation } from "@/features/business/services/company.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowLeft, MapPin, Mail, Star } from "lucide-react";

export default function WorkerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [worker, setWorker] = useState<Worker | null>(null);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("auth:token");
            if (!token) {
                router.push("/");
                return;
            }

            try {
                const workerData = await CompanyService.getWorkerById(token, params.id as string);
                setWorker(workerData);

                const evaluationsData = await CompanyService.getWorkerEvaluations(token, params.id as string);
                setEvaluations(evaluationsData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id, router]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (!worker) {
        return <div className="flex justify-center items-center h-screen">Profissional não encontrado.</div>;
    }

    return (
        <div className="container max-w-4xl py-10 mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2 pl-0">
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </Button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl rounded-xl">
                    <AvatarImage src={worker.fotoRostoUrl} />
                    <AvatarFallback className="rounded-xl">
                        {worker.nomeCompleto.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{worker.nomeCompleto}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            {worker.cidade}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {worker.email}
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Sobre</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{worker.sobre}</p>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Histórico de Avaliações</h2>
                        {evaluations.length === 0 ? (
                            <p className="text-muted-foreground">Nenhuma avaliação encontrada para este profissional.</p>
                        ) : (
                            <div className="space-y-6">
                                {evaluations.map((evaluation) => (
                                    <Card key={evaluation.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{evaluation.nomeEmpresa}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Avaliado em {new Date(evaluation.dataAvaliacao).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-bold">
                                                        {evaluation.nota ? evaluation.nota.toFixed(1) : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-muted/30 p-4 rounded-md mb-4">
                                                <p className="text-sm italic">"{evaluation.descricao}"</p>
                                            </div>

                                            {evaluation.resposta && (
                                                <div className="ml-8 mt-4 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border-l-4 border-blue-500">
                                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                                        Resposta de {evaluation.nomeFuncionario}:
                                                    </p>
                                                    <p className="text-sm text-foreground">
                                                        {evaluation.resposta}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
