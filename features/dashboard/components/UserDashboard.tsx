"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bug as BugIcon, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import { Bug } from "@/types";

export function UserDashboard() {
  const [activeBugs, setActiveBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const bugs = await api.getBugs();
      // Filter for bugs the user might have reported or funded (mocking this logic)
      setActiveBugs(bugs.slice(0, 2));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Submissions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Bugs currently in funding phase</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funded</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$285</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50 flex flex-col justify-center">
          <CardContent className="pt-6">
            <Link href="/submit">
              <Button className="w-full gap-2" size="lg">
                <Plus className="h-4 w-4" /> Report New Bug
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground/90">Your Recent Activity</h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
                <CardContent><Skeleton className="h-20" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeBugs.map((bug) => (
              <Card key={bug.id} className="bg-card/50 backdrop-blur border-border/50 transition-all hover:bg-card/80 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">{bug.title}</CardTitle>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {bug.status}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {bug.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-medium">${bug.fundsRaised} / ${bug.bounty}</span>
                    </div>
                    <Progress value={(bug.fundsRaised / (bug.bounty || 1)) * 100} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/bugs/${bug.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-xs h-8">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
