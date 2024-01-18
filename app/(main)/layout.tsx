import Sidebar from "@/components/sidebar/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="hidden md:flex fixed inset-y-0 h-full w-[72px] flex-col border-r dark:border-0">
        {/* @ts-ignore */}
        <Sidebar />
      </div>

      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
}
