import BottomNav from "@/components/layout/bottom-nav";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
