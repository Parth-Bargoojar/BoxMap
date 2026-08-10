/**
 * Bottom padding clears the fixed mobile bottom-nav (68px + FAB overhang).
 */
export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] p-4 pb-28 md:p-8 md:pb-12">{children}</div>
  );
}
