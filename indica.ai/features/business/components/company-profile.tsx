import { CompanyProfile as CompanyProfileType } from "@/lib/schemas/profile.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Mail, Phone, Globe, Building2, Search, LogOut, Star, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CompanyService, Evaluation, Worker } from "../services/company.service";

interface CompanyProfileProps {
  profile: CompanyProfileType;
  onLogout?: () => void;
}

export function CompanyProfile({ profile, onLogout }: CompanyProfileProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Worker[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const token = localStorage.getItem("auth:token");
      if (token) {
        try {
          const data = await CompanyService.getEvaluations(token);
          setEvaluations(data);
        } catch (error) {
          console.error("Failed to fetch evaluations", error);
        } finally {
          setLoadingEvaluations(false);
        }
      } else {
        setLoadingEvaluations(false);
      }
    };
    fetchEvaluations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setSearching(true);
        setHasSearched(true);
        const token = localStorage.getItem("auth:token");
        if (token) {
          try {
            const results = await CompanyService.searchWorkers(token, searchTerm);
            setSearchResults(results);
          } catch (error) {
            console.error("Failed to search workers", error);
          } finally {
            setSearching(false);
          }
        }
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Avatar className="w-32 h-32 border-4 border-background shadow-xl rounded-xl">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.companyName}`}
          />
          <AvatarFallback className="rounded-xl">
            {profile.companyName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.companyName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4" />
              Company • {profile.cnpj}
            </p>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors mt-2"
                title="Sair para seleção"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {profile.phone}
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="mt-8">
        <Tabs defaultValue="evaluations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evaluations">Avaliações Feitas</TabsTrigger>
            <TabsTrigger value="search">Pesquisar Profissionais</TabsTrigger>
          </TabsList>
          <TabsContent value="evaluations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Realizadas</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingEvaluations ? (
                  <p className="text-center py-8 text-muted-foreground">Carregando...</p>
                ) : evaluations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma avaliação realizada ainda.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{evaluation.nomeFuncionario}</h3>
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="search" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pesquisar Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Buscar por nome ou CPF"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {hasSearched && (
                  <div className="space-y-4">
                    {searching ? (
                      <p className="text-center py-8 text-muted-foreground">Buscando...</p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum profissional encontrado.
                      </p>
                    ) : (
                      searchResults.map((worker) => (
                        <div key={worker.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={worker.fotoRostoUrl} />
                            <AvatarFallback>{worker.nomeCompleto.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{worker.nomeCompleto}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3" />
                              {worker.cidade}
                            </div>
                            <p className="text-sm mt-2 line-clamp-2">{worker.sobre}</p>
                          </div>
                          <Link href={`/worker/${worker.id}`}>
                            <Button variant="outline" size="sm">Ver Perfil</Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {!hasSearched && (
                  <div className="mt-8 text-center text-muted-foreground">
                    <p>Utilize a barra de pesquisa para encontrar profissionais pelo nome.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
