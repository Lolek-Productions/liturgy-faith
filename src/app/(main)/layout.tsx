import { AppSidebar } from "@/components/app-sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <MainHeader />
        <main className="p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}