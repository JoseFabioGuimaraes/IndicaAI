import { WorkerProfile } from "@/lib/schemas/profile.schema";
import { WorkerProfile as WorkerProfileComponent } from "@/features/person/components/worker-profile";
import { AddReviewForm } from "./add-review-form";
import { Card, CardContent } from "@/shared/components/ui/card";

interface ReputationViewProps {
  worker: WorkerProfile;
  viewerId: string; // Company ID viewing the profile
}

export function ReputationView({ worker, viewerId }: ReputationViewProps) {
  return (
    <div className="space-y-8">
      <div className="bg-muted/30 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold mb-4">Search Result</h2>
        {/* Reuse the WorkerProfile component but maybe we want to wrap it or customize it? 
            For now, using it directly is fine as it displays exactly what we need. */}
        <WorkerProfileComponent profile={worker} />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <AddReviewForm
              workerId={worker.userId}
              companyId={viewerId}
              companyName="Current Company" // In real app, fetch this
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
