import { Suspense } from "react";
import { profileService } from "@/lib/services/profile.service";
import { WorkerProfile } from "@/features/person/components/worker-profile";
import { CompanyProfile } from "@/features/business/components/company-profile";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// This is a temporary mock to simulate a logged-in user
// In a real app, you'd get the session from cookies/headers
const MOCK_USER_ID = "worker-1"; // Change to "company-1" to test company view
// const MOCK_USER_ID = "company-1";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  // Allow overriding user via query param for testing: /profile?userId=company-1
  const userId = (params.userId as string) || MOCK_USER_ID;

  // Try to find as worker first
  const workerProfile = await profileService.getWorkerProfile(userId);

  if (workerProfile) {
    return (
      <div className="container py-10">
        <WorkerProfile profile={workerProfile} />
      </div>
    );
  }

  // Try to find as company
  const companyProfile = await profileService.getCompanyProfile(userId);

  if (companyProfile) {
    return (
      <div className="container py-10">
        <CompanyProfile profile={companyProfile} />
      </div>
    );
  }

  return (
    <div className="container py-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">Profile Not Found</h1>
      <p className="text-muted-foreground">
        Could not find a profile for user ID: {userId}
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/profile?userId=worker-1">
          <Button variant="outline">View Worker Mock</Button>
        </Link>
        <Link href="/profile?userId=company-1">
          <Button variant="outline">View Company Mock</Button>
        </Link>
      </div>
    </div>
  );
}
