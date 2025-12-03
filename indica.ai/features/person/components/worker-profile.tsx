import { WorkerProfile as WorkerProfileType } from "@/lib/schemas/profile.schema";
import { StarRating } from "@/shared/components/star-rating";
import { ReviewList } from "@/shared/components/review-list";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface WorkerProfileProps {
  profile: WorkerProfileType;
}

export function WorkerProfile({ profile }: WorkerProfileProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.userId}`}
          />
          <AvatarFallback>
            {profile.fullName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.fullName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Briefcase className="w-4 h-4" />
              Worker
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
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              São Paulo, SP
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
              <StarRating rating={profile.averageRating} size={16} />
              <span className="font-semibold">
                {profile.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-xs">
                ({profile.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Info & Skills */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.bio || "No biography provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {!profile.skills?.length && (
                  <span className="text-sm text-muted-foreground">
                    No skills listed
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Reviews */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Reputation
            </h2>
          </div>

          <ReviewList reviews={profile.reviews || []} />
        </div>
      </div>
    </div>
  );
}
