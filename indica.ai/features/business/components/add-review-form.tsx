"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { StarRating } from "@/shared/components/star-rating";
import { profileService } from "@/lib/services/profile.service";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddReviewFormProps {
  workerId: string;
  companyId: string; // In a real app, this would come from the session
  companyName: string;
  onSuccess?: () => void;
}

export function AddReviewForm({
  workerId,
  companyId,
  companyName,
  onSuccess,
}: AddReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await profileService.submitReview(workerId, {
        id: Math.random().toString(36).substr(2, 9),
        authorId: companyId,
        authorName: companyName,
        targetId: workerId,
        rating,
        comment,
        createdAt: new Date(),
      });

      setComment("");
      setRating(0);
      router.refresh(); // Refresh server components to show new review
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-4 bg-card"
    >
      <h3 className="font-semibold text-lg">Add a Review</h3>

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder="Share your experience working with this person..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
}
