"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { EvaluationService } from "@/features/evaluations/services/evaluation.service";
import { WorkerProfile } from "@/features/person/components/worker-profile";
import { Review, WorkerProfile as WorkerProfileType } from "@/lib/schemas/profile.schema";
import { Spinner } from "@/shared/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchReviews() {
      if (user?.type === "worker") {
        const data = await EvaluationService.getMyEvaluations();
        setReviews(data);
      }
      setFetchingReviews(false);
    }

    if (user) {
      fetchReviews();
    }
  }, [user]);

  if (loading || fetchingReviews) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
      : 0;

  const profile: WorkerProfileType = {
    userId: user.id,
    fullName: user.name,
    email: user.email,
    cpf: user.cpf || "",
    averageRating,
    totalReviews,
    reviews,
    // Optional fields not yet in User model
    phone: "",
    bio: user.bio,
    city: user.city,
    skills: [],
  };

  return (
    <div className="container py-10">
      <WorkerProfile profile={profile} />
    </div>
  );
}
