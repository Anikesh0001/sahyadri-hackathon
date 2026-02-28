"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { UserDashboard } from "@/features/dashboard/components/UserDashboard";
import { DeveloperDashboard } from "@/features/dashboard/components/DeveloperDashboard";
import { AdminDashboard } from "@/features/dashboard/components/AdminDashboard";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Authentication Required</h1>
        <p className="text-muted-foreground max-w-[400px]">
          Please sign in using the button in the navigation bar to access your personalized dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your {user.role.toLowerCase()} workspace.
        </p>
      </div>

      {user.role === "User" && <UserDashboard />}
      {user.role === "Developer" && <DeveloperDashboard />}
      {user.role === "Admin" && <AdminDashboard />}
    </div>
  );
}
