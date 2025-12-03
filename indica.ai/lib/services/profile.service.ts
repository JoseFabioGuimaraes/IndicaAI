import { WorkerProfile, CompanyProfile, Review } from "@/lib/schemas/profile.schema";
import { 
  findWorkerById, 
  findCompanyById, 
  findWorkerByCpf, 
  addReviewToWorker 
} from "@/lib/mock-data";

export class ProfileService {
  // Simulate API delay
  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getWorkerProfile(userId: string): Promise<WorkerProfile | null> {
    await this.delay(500);
    return findWorkerById(userId) || null;
  }

  async getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
    await this.delay(500);
    return findCompanyById(userId) || null;
  }

  async getWorkerReputationByCpf(cpf: string): Promise<WorkerProfile | null> {
    await this.delay(800);
    return findWorkerByCpf(cpf) || null;
  }

  async submitReview(workerId: string, review: Review): Promise<boolean> {
    await this.delay(1000);
    return addReviewToWorker(workerId, review);
  }
}

export const profileService = new ProfileService();
