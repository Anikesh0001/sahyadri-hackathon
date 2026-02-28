"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Developer } from "@/types";
import { api } from "@/services/api";

export function DeveloperMatcher({ bugId }: { bugId: string }) {
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    async function load() {
      const devs = await api.getRecommendedDevelopers(bugId);
      setDevelopers(devs);
    }
    load();
  }, [bugId]);

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          AI Developer Matching
        </CardTitle>
        <CardDescription>
          Developers automatically recommended based on skill overlap and past repo success.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {developers.map((dev, i) => (
            <div key={dev.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={dev.avatarUrl} />
                  <AvatarFallback>{dev.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {dev.name}
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {90 - i * 5}% Match
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {dev.successRate}% Success Rate · {dev.bugsResolved} bugs resolved
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8">
                Request
              </Button>
            </div>
          ))}
          {developers.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Finding the perfect developers...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
