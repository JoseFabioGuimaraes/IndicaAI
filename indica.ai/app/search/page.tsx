import { SearchWorker } from "@/features/business/components/search-worker";
import { ReputationView } from "@/features/business/components/reputation-view";
import { profileService } from "@/lib/services/profile.service";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Info } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const cpf = params.cpf as string;

  // Mock viewer ID (company viewing the worker)
  const viewerId = "company-1";

  let worker = null;
  if (cpf) {
    worker = await profileService.getWorkerReputationByCpf(cpf);
  }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Search Worker Reputation
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter the CPF of the worker you want to check. View their ratings,
          reviews from previous employers, and add your own feedback.
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border">
        <SearchWorker />
      </div>

      {cpf && !worker && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            No worker found with CPF: {cpf}. They might not be registered yet.
          </AlertDescription>
        </Alert>
      )}

      {worker && <ReputationView worker={worker} viewerId={viewerId} />}
    </div>
  );
}
