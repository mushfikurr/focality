import Navbar from "@/components/common/navbar";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:min-h-0">
      <Navbar className="shrink-0" />
      {children}
    </div>
  );
}
