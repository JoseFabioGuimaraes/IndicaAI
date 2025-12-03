import { SelectionType } from "@/features/authentication/components/selection";
import { AnimatedThemeToggler } from "@/shared/components/ui/animated-theme-toggler";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <AnimatedThemeToggler className="absolute top-4 right-4" />
      <SelectionType />
    </div>
  );
}
