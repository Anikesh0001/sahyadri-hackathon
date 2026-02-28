"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bug, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bug className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="inline-block font-bold text-lg hidden sm:block">
              Crowdfund<span className="text-primary">Fix</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/bugs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Marketplace
            </Link>
            <Link
              href="/workflow"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Workflow
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium leading-none">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </header>
  );
}
