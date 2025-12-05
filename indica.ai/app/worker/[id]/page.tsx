"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CompanyService, Worker } from "@/features/business/services/company.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowLeft, MapPin, Mail } from "lucide-react";

export default function WorkerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [worker, setWorker] = useState<Worker | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorker = async () => {
            const token = localStorage.getItem("auth:token");
            if (!token) {
                router.push("/");
                return;
            }

            try {
                // We can reuse the search endpoint or create a specific one.
                // For now, let's assume we can fetch by ID or use the search endpoint to find the specific worker.
                // Ideally, we should have a getById endpoint.
                // Since we don't have a direct getById in CompanyService yet, let's add it or use a workaround.
                // Actually, let's add getWorkerById to CompanyService first.
                const data = await CompanyService.getWorkerById(token, params.id as string);
                setWorker(data);
            } catch (error) {
                console.error("Failed to fetch worker", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchWorker();
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
                </div>
            </div>
        </div>
    );
}
