"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bug, AIAnalysis } from "@/types";
import { api } from "@/services/api";
import { useBugStore } from "@/store/useBugStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Wallet, DollarSign, Clock, Users as UsersIcon, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// AI Panels
import { BugUnderstanding } from "@/features/ai-panels/BugUnderstanding";
import { BountyPrediction } from "@/features/ai-panels/BountyPrediction";
import { DeveloperMatcher } from "@/features/ai-panels/DeveloperMatcher";
import { FixVerification } from "@/features/ai-panels/FixVerification";

export default function BugDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuthStore();
  const { fundBug, bugs } = useBugStore();
  
  const [bug, setBug] = useState<Bug | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState<string>("50");

  useEffect(() => {
    async function load() {
      // Check local store first, then API
      let foundBug = bugs.find(b => b.id === id);
      if (!foundBug) {
        foundBug = await api.getBugById(id);
      }
      
      if (foundBug) {
        setBug(foundBug);
        const aiData = await api.getAIAnalysis(id);
        setAnalysis(aiData);
      }
      setLoading(false);
    }
    load();
  }, [id, bugs]);

  const handleFund = () => {
    const amount = parseInt(fundAmount);
    if (isNaN(amount) || amount <= 0) return;
    fundBug(id, amount);
    // Simulate updating local state for immediate feedback
    if (bug) {
      setBug({
        ...bug,
        fundsRaised: bug.fundsRaised + amount,
        contributors: bug.contributors + 1
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!bug || !analysis) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">Bug not found.</div>;
  }

  const fundingPercentage = Math.min(100, Math.round((bug.fundsRaised / (bug.bounty || 1)) * 100));

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Col: Details & AI Panels */}
        <div className="flex-1 space-y-8">
          {/* Header Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={bug.status === "Open" ? "default" : bug.status === "Funded" ? "secondary" : "outline"} className="capitalize">
                {bug.status}
              </Badge>
              <Badge variant="outline">{bug.severity} Severity</Badge>
              <span className="text-xs text-muted-foreground ml-2">Posted structured 2 days ago</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{bug.title}</h1>
            <p className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">{bug.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
               {bug.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
               ))}
            </div>
            <a href={bug.repoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
               <Github className="h-4 w-4" />
               View Repository
            </a>
          </div>

          <hr className="border-border/50" />

          {/* AI Insights Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
               🧠 AI Intelligence Report
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <BugUnderstanding analysis={analysis} />
              <BountyPrediction analysis={analysis} />
            </div>

            {/* Developer Matching shown if open */}
            {(bug.status === "Open" || bug.status === "Funded") && (
              <DeveloperMatcher bugId={bug.id} />
            )}

            {/* Verification shown if claimed/resolved */}
            {(bug.status === "In Review" || bug.status === "Resolved") && (
              <FixVerification bugId={bug.id} />
            )}
          </div>
        </div>

        {/* Right Col: Crowdfunding Panel */}
        <div className="lg:w-[380px] shrink-0">
          <Card className="sticky top-24 border-primary/20 shadow-2xl shadow-primary/5 bg-card/60 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Fix Bounty
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-4xl font-mono font-bold text-foreground">
                    ${bug.fundsRaised}
                  </div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    of <span className="text-foreground font-semibold">${bug.bounty}</span> target
                  </div>
                </div>
                <Progress value={fundingPercentage} className="h-3 rounded-full bg-muted/80" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <UsersIcon className="h-3.5 w-3.5" /> Backers
                  </div>
                  <div className="font-semibold text-lg">{bug.contributors}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Time Left
                  </div>
                  <div className="font-semibold text-lg">14d 6h</div>
                </div>
              </div>

              {bug.status !== "Resolved" && bug.status !== "In Review" && (
                <div className="pt-4 border-t border-border/50 space-y-4">
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input 
                         type="number" 
                         value={fundAmount} 
                         onChange={(e) => setFundAmount(e.target.value)}
                         className="pl-8"
                       />
                     </div>
                     <Button 
                       onClick={handleFund} 
                       disabled={!user || user.role === 'Developer'}
                       className="w-[120px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20"
                     >
                       Fund Fix
                     </Button>
                  </div>
                  {!user && <p className="text-xs text-center text-red-400">Log in as a User to fund this bug.</p>}
                  {user?.role === 'Developer' && <p className="text-xs text-center text-muted-foreground">Developers cannot fund bounties.</p>}
                </div>
              )}
            </CardContent>
            {user?.role === 'Developer' && (bug.status === "Open" || bug.status === "Funded") && (
              <CardFooter className="bg-muted/30 border-t border-border pt-4">
                <Button className="w-full text-lg h-12">Claim & Resolve Bug</Button>
              </CardFooter>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
