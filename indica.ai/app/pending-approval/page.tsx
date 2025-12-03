"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "@/features/authentication/hooks/useAuth";

export default function PendingApprovalPage() {
    const { logout } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader className="flex flex-col items-center gap-4 pb-2">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Clock className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">Cadastro em Análise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                        Obrigado por se cadastrar! Seus documentos foram enviados e estão sendo analisados pela nossa equipe.
                    </p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        Você receberá um e-mail assim que seu cadastro for aprovado. Por enquanto, seu acesso está limitado.
                    </p>
                    <Button variant="outline" onClick={logout} className="w-full gap-2">
                        <LogOut className="w-4 h-4" />
                        Sair
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
