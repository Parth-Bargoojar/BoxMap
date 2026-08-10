export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">{children}</div>;
}