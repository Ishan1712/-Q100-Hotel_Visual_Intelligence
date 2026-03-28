import ManagerSidebar from "../components/manager/ManagerSidebar";
import ManagerHeader from "../components/manager/ManagerHeader";

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex bg-[#f8fafc]">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        <ManagerHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
