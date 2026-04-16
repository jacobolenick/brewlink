import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Navbar userName={session.user.name ?? session.user.email} />
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "2rem 1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
