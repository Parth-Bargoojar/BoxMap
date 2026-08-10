import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass mx-auto max-w-[440px] space-y-5 rounded-3xl px-6 py-14 text-center shadow-glass-lg">
        <div className="glass-subtle mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-text-muted shadow-glass">
          <PackageSearch className="h-8 w-8 stroke-[1.5]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Page not found</h1>
          <p className="text-sm text-text-secondary">
            We couldn&apos;t find the page you were looking for.
          </p>
        </div>

        <Link href="/" className="inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
