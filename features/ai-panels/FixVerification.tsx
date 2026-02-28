"use client";

import { CheckCircle, XCircle, Code2, GitMerge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function FixVerification({ bugId }: { bugId: string }) {
  // Hardcoded simulation for the prototype
  const verification = {
    passed: true,
    similarityScore: 92,
    diffSummary: "Modified AuthInterceptor to clear tokens on 401 response before redirecting.",
    prLink: "https://github.com/organization/auth-service/pull/42",
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitMerge className="h-5 w-5 text-primary" />
          Automated Fix Verification
        </CardTitle>
        <CardDescription>
          AI analysis of the submitted Pull Request against expected behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg flex items-start gap-4 border ${verification.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
           {verification.passed ? (
             <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
           ) : (
             <XCircle className="h-6 w-6 text-red-500 shrink-0" />
           )}
           <div>
             <h4 className={`font-semibold ${verification.passed ? 'text-green-500' : 'text-red-500'}`}>
               {verification.passed ? "Fix Verified & Approved" : "Verification Failed"}
             </h4>
             <p className="text-sm text-muted-foreground mt-1">
               {verification.diffSummary}
             </p>
           </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
             <span className="text-muted-foreground">Expected Behavior Similarity</span>
             <span className="font-semibold">{verification.similarityScore}%</span>
          </div>
          <Progress value={verification.similarityScore} className="h-2" />
        </div>

        <div className="pt-2">
          <a href={verification.prLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
            <Code2 className="h-4 w-4" /> View Pull Request
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
