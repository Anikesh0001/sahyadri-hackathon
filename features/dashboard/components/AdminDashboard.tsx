"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users, Bug as BugIcon, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import { Bug } from "@/types";
import Link from "next/link";

export function AdminDashboard() {
  const [pendingVerifications, setPendingVerifications] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const bugs = await api.getBugs();
      // Filter for bugs in 'In Review' state to verify
      setPendingVerifications(bugs.filter(b => b.status === "Funded" || b.status === "Open").slice(0, 2)); // Mocking some pending
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Platform Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Users", value: "1,245", icon: <Users className="h-4 w-4 text-blue-500" /> },
          { title: "Active Bugs", value: "342", icon: <BugIcon className="h-4 w-4 text-red-500" /> },
          { title: "Verifications Pending", value: "12", icon: <ShieldCheck className="h-4 w-4 text-amber-500" /> },
          { title: "Platform Health", value: "99.9%", icon: <Activity className="h-4 w-4 text-green-500" /> },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Verification Queue */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Verification Queue & AI Audits</CardTitle>
            <CardDescription>Review PRs flagged by AI for manual admin approval.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((bug) => (
                  <div key={bug.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm">{bug.title}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        AI Confidence: 94%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reject</Button>
                      <Button variant="default" size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
                {pendingVerifications.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">No pending verifications.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Activity Log */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>Live stream of funding and resolutions.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="relative border-l border-border ml-3 space-y-6">
                {[
                  { user: "User-3", action: "funded $150 towards", target: "Memory leak...", time: "2 mins ago" },
                  { user: "Dev-Elena", action: "claimed bug", target: "Mobile navigation overla...", time: "1 hour ago" },
                  { user: "AI System", action: "verified fix for", target: "Auth token loop", time: "3 hours ago" },
                ].map((act, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{act.user}</span>{" "}
                      <span className="text-muted-foreground">{act.action}</span>{" "}
                      <span className="font-medium text-foreground">{act.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{act.time}</p>
                  </div>
                ))}
             </div>
             <div className="mt-6 flex justify-end">
               <Link href="/analytics">
                 <Button variant="ghost" size="sm">View All Analytics →</Button>
               </Link>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
