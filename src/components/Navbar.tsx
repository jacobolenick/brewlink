"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  userName?: string | null;
}

export default function Navbar({ userName }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header
      style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "white",
              boxShadow: "0 0 16px var(--accent-glow)",
            }}
          >
            B
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", letterSpacing: "-0.02em" }}>
            BrewLink
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavLink href="/dashboard" active={pathname === "/dashboard"}>
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/links" active={pathname.startsWith("/dashboard/links")}>
            My Links
          </NavLink>
        </nav>

        {/* User menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {userName && (
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {userName}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid var(--border-bright)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "var(--bg-elevated)";
              (e.target as HTMLElement).style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.color = "var(--text-muted)";
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "5px 12px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        color: active ? "var(--text)" : "var(--text-muted)",
        background: active ? "var(--bg-elevated)" : "transparent",
        textDecoration: "none",
        transition: "all 0.15s",
      }}
    >
      {children}
    </Link>
  );
}
