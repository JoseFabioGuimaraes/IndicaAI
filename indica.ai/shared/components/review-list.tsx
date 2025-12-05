import { Review } from "@/lib/schemas/profile.schema";
import { StarRating } from "./star-rating";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { MessageSquareReply } from "lucide-react";
import { format } from "date-fns";

interface ReviewListProps {
  reviews: Review[];
  userName: string;
  onReply?: (reviewId: string) => void;
}

export function ReviewList({ reviews, userName, onReply }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-none shadow-sm bg-muted/30">
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.authorName}`}
              />
              <AvatarFallback>
                {review.authorName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{review.authorName}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.createdAt), "PPP")}
                </span>
              </div>
              <StarRating rating={review.rating} size={14} className="mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {review.comment}
            </p>
            {review.reply ? (
              <div className="mt-4 bg-muted p-3 rounded-md text-sm">
                <p className="font-semibold text-xs text-muted-foreground mb-1">
                  Resposta de {userName}:
                </p>
                <p className="text-foreground/90">{review.reply}</p>
              </div>
            ) : (
              onReply && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => onReply(review.id)}>
                    <MessageSquareReply className="w-4 h-4 mr-2" />
                    Responder
                  </Button>
                </div>
              )
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
