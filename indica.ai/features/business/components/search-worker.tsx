"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchWorker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cpf, setCpf] = useState(searchParams.get("cpf") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf.trim()) return;

    setIsLoading(true);
    // Update URL with CPF query param to trigger server-side fetch in parent/page
    router.push(`/search?cpf=${encodeURIComponent(cpf)}`);
    // We don't set isLoading to false here because the page navigation will handle the loading state
    // or we can just let it spin until the new page loads.
    // For better UX, we might want to use a transition, but this is simple enough.
    setTimeout(() => setIsLoading(false), 1000); // Reset after a bit just in case
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Enter CPF (e.g., 123.456.789-00)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
      </Button>
    </form>
  );
}
