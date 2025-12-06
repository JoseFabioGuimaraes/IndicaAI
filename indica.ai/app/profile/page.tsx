"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { AuthService } from "@/features/authentication/services/auth.service";
import { EvaluationService } from "@/features/evaluations/services/evaluation.service";
import { WorkerProfile } from "@/features/person/components/worker-profile";
import { CompanyProfile } from "@/features/business/components/company-profile";
import { Review, WorkerProfile as WorkerProfileType, CompanyProfile as CompanyProfileType } from "@/lib/schemas/profile.schema";
import { Spinner } from "@/shared/components/ui/spinner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

export default function ProfilePage() {
  const { user, loading, logoutToSelection } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const router = useRouter();

  // Reply State
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Bio Edit State
  const [isBioDialogOpen, setIsBioDialogOpen] = useState(false);
  const [bioText, setBioText] = useState("");
  const [submittingBio, setSubmittingBio] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  async function fetchReviews() {
    if (user?.type === "worker") {
      const data = await EvaluationService.getMyEvaluations();
      setReviews(data);
    }
    setFetchingReviews(false);
  }

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const handleOpenReplyDialog = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setReplyText("");
    setIsReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedReviewId || !replyText.trim()) return;

    setSubmittingReply(true);
    const token = localStorage.getItem("auth:token");
    if (token) {
      try {
        await EvaluationService.replyToEvaluation(token, selectedReviewId, replyText);
        setIsReplyDialogOpen(false);
        fetchReviews(); // Refresh to show the reply
      } catch (error) {
        console.error("Failed to submit reply", error);
        // Ideally show a toast error here
      } finally {
        setSubmittingReply(false);
      }
    }
  };

  const handleOpenBioDialog = () => {
    setBioText(user?.bio || "");
    setIsBioDialogOpen(true);
  };

  const handleSubmitBio = async () => {
    if (!user) return;
    setSubmittingBio(true);
    try {
      // Assuming AuthService is imported and available
      await AuthService.updateWorkerProfile(user.id, {
        nomeCompleto: user.name,
        email: user.email,
        cidade: user.city,
        sobre: bioText
      });
      // For now, simulating an update
      // console.log("Updating bio for user:", user.id, "with bio:", bioText);
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // We need to reload the page or update the context to reflect changes.
      // For now, a full reload is safest to update AuthContext, or we could expose a refreshUser method in AuthContext.
      // Since AuthContext doesn't expose refresh, we'll reload.
      window.location.reload();
    } catch (error) {
      console.error("Failed to update bio", error);
    } finally {
      setSubmittingBio(false);
      setIsBioDialogOpen(false);
    }
  };

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

  if (user.type === "company") {
    const companyProfile: CompanyProfileType = {
      userId: user.id,
      companyName: user.name,
      cnpj: user.cnpj || "",
      email: user.email,
      phone: "", // Add phone to user model if needed
      website: "", // Add website to user model if needed
      description: user.bio,
    };

    return (
      <div className="container py-10">
        <CompanyProfile profile={companyProfile} onLogout={logoutToSelection} />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <WorkerProfile
        profile={profile}
        onLogout={logoutToSelection}
        onReply={handleOpenReplyDialog}
        isEditable={true}
        onEditBio={handleOpenBioDialog}
      />

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder Avaliação</DialogTitle>
            <DialogDescription>
              Sua resposta ficará visível publicamente no seu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reply">Sua Resposta</Label>
              <Textarea
                id="reply"
                placeholder="Escreva sua resposta aqui..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)} disabled={submittingReply}>Cancelar</Button>
            <Button onClick={handleSubmitReply} disabled={submittingReply || !replyText.trim()}>
              {submittingReply ? "Enviando..." : "Enviar Resposta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioDialogOpen} onOpenChange={setIsBioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sobre</DialogTitle>
            <DialogDescription>
              Atualize sua biografia profissional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bio">Sobre</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBioDialogOpen(false)} disabled={submittingBio}>Cancelar</Button>
            <Button onClick={handleSubmitBio} disabled={submittingBio}>
              {submittingBio ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
