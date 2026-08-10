import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
