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
import { Mail, Phone, Globe, Building2, Search, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import Link from "next/link";

interface CompanyProfileProps {
  profile: CompanyProfileType;
  onLogout?: () => void;
}

export function CompanyProfile({ profile, onLogout }: CompanyProfileProps) {
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

        <div className="shrink-0">
          <Link href="/search">
            <Button size="lg" className="gap-2 shadow-lg">
              <Search className="w-4 h-4" />
              Search Workers
            </Button>
          </Link>
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
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma avaliação realizada ainda.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="search" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pesquisar Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Buscar por nome, cargo ou habilidades..."
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                    />
                  </div>
                  <Button>Buscar</Button>
                </div>
                <div className="mt-8 text-center text-muted-foreground">
                  <p>Utilize a barra de pesquisa para encontrar profissionais.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
