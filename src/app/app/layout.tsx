import AppNavbar from "@/components/layout/AppNavbar";

export default function AppMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B1114] flex flex-col">
      <AppNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
