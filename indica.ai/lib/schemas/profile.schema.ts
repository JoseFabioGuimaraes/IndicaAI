import { z } from "zod";

export const RatingSchema = z.object({
  score: z.number().min(1).max(5),
  count: z.number().int().nonnegative(),
});

export type Rating = z.infer<typeof RatingSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  targetId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment cannot be empty"),
  createdAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

export const WorkerProfileSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  averageRating: z.number().min(0).max(5).default(0),
  totalReviews: z.number().int().nonnegative().default(0),
  reviews: z.array(ReviewSchema).optional(),
});

export type WorkerProfile = z.infer<typeof WorkerProfileSchema>;

export const CompanyProfileSchema = z.object({
  userId: z.string(),
  companyName: z.string(),
  cnpj: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;
