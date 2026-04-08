import { AdminNav } from "@/components/layout/AdminNav";

export const metadata = {
  title: "Admin Dashboard | Renters HQ",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-gray-900 font-sans flex flex-col">
      <AdminNav />
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1100px] mx-auto p-6 md:p-8">
        {children}
      </main>
      
    </div>
  )
}
