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
import { Mail, Phone, Globe, Building2, Search } from "lucide-react";
import Link from "next/link";

interface CompanyProfileProps {
  profile: CompanyProfileType;
}

export function CompanyProfile({ profile }: CompanyProfileProps) {
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

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {profile.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Looking for a new employee? Check their reputation before
                hiring.
              </p>
              <Link href="/search" className="block">
                <Button className="w-full" variant="outline">
                  Check Reputation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
