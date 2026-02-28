"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import { Bug } from "@/types";

export default function BugsMarketplacePage() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadBugs() {
      const data = await api.getBugs();
      setBugs(data);
      setLoading(false);
    }
    loadBugs();
  }, []);

  const filteredBugs = bugs.filter(bug => 
    bug.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    bug.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bug Marketplace</h1>
          <p className="text-muted-foreground mt-1">Explore and fund open bug bounties or claim issues to solve.</p>
        </div>
        <Link href="/submit">
          <Button>Report a Bug</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search bugs, languages, tags..." 
            className="pl-9 h-12 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[280px] w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBugs.map((bug) => (
            <Card key={bug.id} className="bg-card/40 hover:bg-card/60 transition-colors border-border/50 flex flex-col backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={bug.status === "Open" ? "default" : bug.status === "Funded" ? "secondary" : "outline"} className="capitalize">
                    {bug.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border border-border">
                    <Cpu className="h-3 w-3 text-primary" />
                    AI Score: {bug.aiScore || '--'}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 leading-tight hover:text-primary transition-colors">
                  <Link href={`/bugs/${bug.id}`}>{bug.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bug.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Bounty Pool</span>
                      <span className="font-mono font-bold text-lg">${bug.bounty}</span>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-medium text-foreground">{Math.round((bug.fundsRaised/(bug.bounty||1))*100)}%</span> funded
                    </div>
                  </div>
                  <Progress value={(bug.fundsRaised/(bug.bounty||1))*100} className="h-1.5" />
                  <div className="text-xs text-muted-foreground mt-2 text-right">
                    {bug.contributors} contributors
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/bugs/${bug.id}`} className="w-full">
                  <Button variant="ghost" className="w-full justify-between hover:bg-primary/10 hover:text-primary">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          {filteredBugs.length === 0 && (
             <div className="col-span-full py-16 text-center text-muted-foreground">
               No bugs found matching your criteria.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
