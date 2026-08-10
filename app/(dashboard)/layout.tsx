import BottomNav from "@/components/layout/bottom-nav";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col w-full">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}