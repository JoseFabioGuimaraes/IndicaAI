import { WorkerProfile, CompanyProfile, Review } from "@/lib/schemas/profile.schema";

// Mock Data Store
export const MOCK_WORKERS: WorkerProfile[] = [
  {
    userId: "worker-1",
    fullName: "João Silva",
    cpf: "123.456.789-00",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    bio: "Experienced electrician with over 10 years of field work.",
    skills: ["Electrical Wiring", "Maintenance", "Safety Inspection"],
    averageRating: 4.5,
    totalReviews: 2,
    reviews: [
      {
        id: "review-1",
        authorId: "company-1",
        authorName: "Tech Solutions Ltd",
        targetId: "worker-1",
        rating: 5,
        comment: "Excellent work! Very professional and punctual.",
        createdAt: new Date("2023-10-15"),
      },
      {
        id: "review-2",
        authorId: "company-2",
        authorName: "BuildIt Corp",
        targetId: "worker-1",
        rating: 4,
        comment: "Good job, but slightly delayed.",
        createdAt: new Date("2023-11-01"),
      },
    ],
  },
  {
    userId: "worker-2",
    fullName: "Maria Oliveira",
    cpf: "987.654.321-00",
    email: "maria.oliveira@example.com",
    phone: "(21) 91234-5678",
    bio: "Dedicated cleaner with attention to detail.",
    skills: ["Cleaning", "Organization", "Hygiene Standards"],
    averageRating: 5,
    totalReviews: 1,
    reviews: [
      {
        id: "review-3",
        authorId: "company-1",
        authorName: "Tech Solutions Ltd",
        targetId: "worker-2",
        rating: 5,
        comment: "Best cleaning service we have ever had.",
        createdAt: new Date("2023-10-20"),
      },
    ],
  },
];

export const MOCK_COMPANIES: CompanyProfile[] = [
  {
    userId: "company-1",
    companyName: "Tech Solutions Ltd",
    cnpj: "12.345.678/0001-90",
    email: "contact@techsolutions.com",
    phone: "(11) 3333-4444",
    description: "Leading technology provider in the region.",
    website: "https://techsolutions.com",
  },
  {
    userId: "company-2",
    companyName: "BuildIt Corp",
    cnpj: "98.765.432/0001-10",
    email: "info@buildit.com",
    phone: "(21) 2222-1111",
    description: "Construction and renovation experts.",
    website: "https://buildit.com",
  },
];

// Helper functions to simulate DB operations
export const findWorkerByCpf = (cpf: string) => {
  return MOCK_WORKERS.find((w) => w.cpf === cpf);
};

export const findWorkerById = (id: string) => {
  return MOCK_WORKERS.find((w) => w.userId === id);
};

export const findCompanyById = (id: string) => {
  return MOCK_COMPANIES.find((c) => c.userId === id);
};

export const addReviewToWorker = (workerId: string, review: Review) => {
  const worker = MOCK_WORKERS.find((w) => w.userId === workerId);
  if (worker) {
    if (!worker.reviews) {
      worker.reviews = [];
    }
    worker.reviews.push(review);
    
    // Recalculate average
    const totalScore = worker.reviews.reduce((acc, r) => acc + r.rating, 0);
    worker.totalReviews = worker.reviews.length;
    worker.averageRating = totalScore / worker.totalReviews;
    
    return true;
  }
  return false;
};
